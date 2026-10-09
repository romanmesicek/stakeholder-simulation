-- Migration: facilitator owner keys, atomic group assignment, RLS lockdown
-- Run in the Supabase SQL Editor BEFORE deploying the matching app version.
--
-- What this changes:
--   1. Sessions get an owner_key_hash; management (close/reopen/delete,
--      move/remove participants) requires the matching plain key, which the
--      app stores in the facilitator's localStorage. Sessions created before
--      this migration have no key and remain manageable by anyone — delete
--      them when convenient.
--   2. Joining happens through join_session(), which assigns the group
--      atomically under an advisory lock, so simultaneous joins can no longer
--      overfill or skew groups.
--   3. The "allow all" RLS policies are replaced: anonymous clients can only
--      SELECT; every write goes through the SECURITY DEFINER functions below.
--
-- NOTE: the unique index on participant names fails if a session already has
-- duplicate names. Find them first with:
--   SELECT session_id, lower(name), count(*) FROM participants
--   GROUP BY 1, 2 HAVING count(*) > 1;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE sessions ADD COLUMN IF NOT EXISTS owner_key_hash TEXT;

-- One name per session (case-insensitive); join_session treats a conflicting
-- concurrent insert as a rejoin instead of failing.
CREATE UNIQUE INDEX IF NOT EXISTS idx_participants_session_name
  ON participants (session_id, lower(name));

-- ---------------------------------------------------------------------------
-- Owner check (legacy sessions without a key hash stay open to everyone)
-- ---------------------------------------------------------------------------
-- search_path includes extensions because Supabase installs pgcrypto there
CREATE OR REPLACE FUNCTION assert_session_owner(p_session_id TEXT, p_owner_key TEXT)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions AS $$
DECLARE
  v_hash TEXT;
BEGIN
  SELECT owner_key_hash INTO v_hash FROM sessions WHERE id = p_session_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'SESSION_NOT_FOUND';
  END IF;
  IF v_hash IS NOT NULL
     AND (p_owner_key IS NULL OR encode(digest(p_owner_key, 'sha256'), 'hex') <> v_hash) THEN
    RAISE EXCEPTION 'NOT_AUTHORIZED';
  END IF;
END $$;

CREATE OR REPLACE FUNCTION verify_owner_key(p_session_id TEXT, p_owner_key TEXT)
RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  PERFORM assert_session_owner(p_session_id, p_owner_key);
  RETURN true;
EXCEPTION WHEN OTHERS THEN
  RETURN false;
END $$;

-- ---------------------------------------------------------------------------
-- Session lifecycle
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION create_session(
  p_id TEXT,
  p_scenario TEXT,
  p_education_level TEXT,
  p_active_groups TEXT[],
  p_max_per_group INTEGER,
  p_owner_key TEXT
) RETURNS sessions
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions AS $$
DECLARE
  v_session sessions;
BEGIN
  IF p_owner_key IS NULL OR length(p_owner_key) < 16 THEN
    RAISE EXCEPTION 'INVALID_OWNER_KEY';
  END IF;
  IF array_length(p_active_groups, 1) IS NULL OR array_length(p_active_groups, 1) < 2 THEN
    RAISE EXCEPTION 'TOO_FEW_GROUPS';
  END IF;

  INSERT INTO sessions (id, status, scenario, education_level, active_groups, max_per_group, owner_key_hash)
  VALUES (
    p_id,
    'open',
    p_scenario,
    p_education_level,
    p_active_groups,
    GREATEST(1, LEAST(20, COALESCE(p_max_per_group, 4))),
    encode(digest(p_owner_key, 'sha256'), 'hex')
  )
  RETURNING * INTO v_session;

  RETURN v_session;
END $$;

CREATE OR REPLACE FUNCTION set_session_status(p_session_id TEXT, p_owner_key TEXT, p_status TEXT)
RETURNS sessions
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_session sessions;
BEGIN
  IF p_status NOT IN ('open', 'closed') THEN
    RAISE EXCEPTION 'INVALID_STATUS';
  END IF;
  PERFORM assert_session_owner(p_session_id, p_owner_key);

  UPDATE sessions SET status = p_status WHERE id = p_session_id
  RETURNING * INTO v_session;
  RETURN v_session;
END $$;

CREATE OR REPLACE FUNCTION delete_session(p_session_id TEXT, p_owner_key TEXT)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  PERFORM assert_session_owner(p_session_id, p_owner_key);
  DELETE FROM sessions WHERE id = p_session_id;
END $$;

-- ---------------------------------------------------------------------------
-- Atomic join: assigns the least-populated active group, ties broken by the
-- client-supplied priority order, serialized per session via advisory lock.
-- Returns the existing participant when the name is already registered.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION join_session(
  p_session_id TEXT,
  p_name TEXT,
  p_group_priority TEXT[] DEFAULT NULL
) RETURNS participants
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_session sessions;
  v_participant participants;
  v_name TEXT;
  v_group TEXT;
BEGIN
  v_name := regexp_replace(btrim(p_name), '\s+', ' ', 'g');
  IF v_name IS NULL OR length(v_name) < 2 OR length(v_name) > 30 THEN
    RAISE EXCEPTION 'INVALID_NAME';
  END IF;

  -- Serialize joins per session so group counts are race-free
  PERFORM pg_advisory_xact_lock(hashtext(p_session_id));

  SELECT * INTO v_session FROM sessions WHERE id = p_session_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'SESSION_NOT_FOUND';
  END IF;

  -- Same name already registered → rejoin (works in closed sessions too)
  SELECT * INTO v_participant FROM participants
  WHERE session_id = p_session_id AND lower(name) = lower(v_name);
  IF FOUND THEN
    RETURN v_participant;
  END IF;

  IF v_session.status = 'closed' THEN
    RAISE EXCEPTION 'SESSION_CLOSED';
  END IF;

  SELECT g INTO v_group
  FROM unnest(v_session.active_groups) AS g
  LEFT JOIN LATERAL (
    SELECT count(*) AS c FROM participants
    WHERE session_id = p_session_id AND stakeholder_group = g
  ) cnt ON true
  WHERE cnt.c < v_session.max_per_group
  ORDER BY cnt.c ASC, COALESCE(array_position(p_group_priority, g), 999) ASC
  LIMIT 1;

  IF v_group IS NULL THEN
    RAISE EXCEPTION 'GROUPS_FULL';
  END IF;

  INSERT INTO participants (session_id, name, stakeholder_group)
  VALUES (p_session_id, v_name, v_group)
  RETURNING * INTO v_participant;
  RETURN v_participant;
END $$;

-- ---------------------------------------------------------------------------
-- Participant management (facilitator only)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION move_participant(p_participant_id UUID, p_owner_key TEXT, p_new_group TEXT)
RETURNS participants
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_participant participants;
  v_session sessions;
BEGIN
  SELECT * INTO v_participant FROM participants WHERE id = p_participant_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'PARTICIPANT_NOT_FOUND';
  END IF;
  PERFORM assert_session_owner(v_participant.session_id, p_owner_key);

  SELECT * INTO v_session FROM sessions WHERE id = v_participant.session_id;
  IF NOT (p_new_group = ANY (v_session.active_groups)) THEN
    RAISE EXCEPTION 'INVALID_GROUP';
  END IF;

  UPDATE participants SET stakeholder_group = p_new_group WHERE id = p_participant_id
  RETURNING * INTO v_participant;
  RETURN v_participant;
END $$;

CREATE OR REPLACE FUNCTION remove_participant(p_participant_id UUID, p_owner_key TEXT)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_session_id TEXT;
BEGIN
  SELECT session_id INTO v_session_id FROM participants WHERE id = p_participant_id;
  IF NOT FOUND THEN
    RETURN; -- already gone
  END IF;
  PERFORM assert_session_owner(v_session_id, p_owner_key);
  DELETE FROM participants WHERE id = p_participant_id;
END $$;

-- ---------------------------------------------------------------------------
-- RLS lockdown: reads stay open (join by code + realtime need them; the
-- owner_key_hash column only ever holds a SHA-256 of a random 128-bit key),
-- writes only via the functions above.
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "Allow all for sessions" ON sessions;
DROP POLICY IF EXISTS "Allow all for participants" ON participants;
DROP POLICY IF EXISTS "sessions_read" ON sessions;
DROP POLICY IF EXISTS "participants_read" ON participants;

CREATE POLICY "sessions_read" ON sessions FOR SELECT USING (true);
CREATE POLICY "participants_read" ON participants FOR SELECT USING (true);
