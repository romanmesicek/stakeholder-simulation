-- Migration: machine-readable error codes for join_session()
-- Optional for existing installs: the app also understands the message-only
-- errors raised by migration 03. Run in the Supabase SQL Editor at any time.
--
-- PostgREST maps a SQLSTATE of the form PTxyz to HTTP status xyz and exposes
-- it as error.code, so the client no longer has to string-match the message.
-- The message text is kept unchanged as fallback for older clients.

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
    RAISE EXCEPTION 'INVALID_NAME' USING ERRCODE = 'PT400';
  END IF;

  -- Serialize joins per session so group counts are race-free
  PERFORM pg_advisory_xact_lock(hashtext(p_session_id));

  SELECT * INTO v_session FROM sessions WHERE id = p_session_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'SESSION_NOT_FOUND' USING ERRCODE = 'PT404';
  END IF;

  -- Same name already registered → rejoin (works in closed sessions too)
  SELECT * INTO v_participant FROM participants
  WHERE session_id = p_session_id AND lower(name) = lower(v_name);
  IF FOUND THEN
    RETURN v_participant;
  END IF;

  IF v_session.status = 'closed' THEN
    RAISE EXCEPTION 'SESSION_CLOSED' USING ERRCODE = 'PT423';
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
    RAISE EXCEPTION 'GROUPS_FULL' USING ERRCODE = 'PT409';
  END IF;

  INSERT INTO participants (session_id, name, stakeholder_group)
  VALUES (p_session_id, v_name, v_group)
  RETURNING * INTO v_participant;
  RETURN v_participant;
END $$;
