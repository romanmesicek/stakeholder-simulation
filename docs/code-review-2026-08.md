# Code Review — August 2026

Consolidated findings from a three-track review (bugs/robustness, student UX journey, facilitator flow & architecture) ahead of the fall semester. Context: several bachelor + master courses will use the app; later steps are content improvements (step 2) and a possible SaaS offering (step 3).

Status legend: ☐ open · ☑ fixed

---

## Critical

### ☐ C-1 · No auth + wide-open RLS: anyone can see, close, and delete every session
- `README.md:89-93` — `CREATE POLICY "Allow all" ... USING (true) WITH CHECK (true)` on both tables.
- `/facilitate` (`src/App.jsx:30`) has no access control; `useAllSessions.js` lists and deletes any session. The anon key ships in the bundle, so the Supabase REST API is equally open (delete cascades to all participants).
- **Fix (staged):**
  1. *Fall semester:* add `owner_key` to `sessions` (random secret kept in the facilitator's localStorage, displayed once for cross-device recovery). Restrict `UPDATE`/`DELETE` via RLS to a key match (checked through a Postgres function); participants get INSERT-own-row + SELECT-per-session only.
  2. *SaaS:* Supabase Auth (magic link), `owner_id uuid references auth.users`, RLS `owner_id = auth.uid()`.

### ☐ C-2 · Group auto-assignment races on mass join → groups overfill
- `src/pages/JoinSession.jsx:52-76`, `src/lib/sessionUtils.js:12-44` — "least populated group" is computed client-side from a realtime snapshot that lags; the insert has no server-side guard. When ~30 students join within seconds (the normal case), several pick the same group; `max_per_group` is advisory only.
- **Fix:** Postgres RPC (`join_session(code, name)`, SECURITY DEFINER) that counts, assigns, and inserts atomically; client calls `supabase.rpc()`. `assignToGroup` ports ~1:1 to plpgsql.

## High — student journey

### ☐ H-1 · Duplicate first names silently merge two students into one identity
- `src/pages/JoinSession.jsx:41-50` — rejoin-by-name matches case-insensitively with no confirmation. The second "Anna" in a class is silently logged in as the first. Mirror image: a rejoin typo ("Jonas M" vs "Jonas") creates a duplicate participant in a possibly different group.
- **Fix:** confirmation step on name collision ("Rejoin as Anna in group X — is that you?" / "No, I'm a different Anna" → suffix). Prefer a localStorage token match; name is the fallback. Fuzzy hint (startsWith) before creating near-duplicates.

### ☐ H-2 · Rejoin is blocked once the session is closed
- `src/pages/JoinSession.jsx:112-121` — the closed-state screen renders before rejoin logic. Facilitator closes after the join phase (natural behavior); a student whose phone died can't get back to their role.
- **Fix:** keep the name field visible when closed ("Already joined? Rejoin by name"); block only new inserts.

### ☐ H-3 · Content-load failure masquerades as "Session not found."
- `src/pages/ParticipantView.jsx:72-79, 93-101` — failed dynamic import (bad wifi, mid-class deploy invalidating hashed chunks) leaves `content` null → wrong error, students re-type codes and can trigger H-1.
- **Fix:** distinct state + Retry button; optionally preload all content chunks right after join.

### ☐ H-4 · Talstadt students get an all-English participant UI
- `ParticipantView.jsx`, `JoinSession.jsx`, `Landing.jsx`, `GroupMembersList.jsx`, `NavMenu.jsx` — info pages are localized, but the join flow, participant view, nav, and all error messages are English-only. The accordion "🎭 Staying in Role" (`ParticipantView.jsx:134`) renders Talstadt's "Informationsmaterialien" under a wrong label.
- **Fix:** `language: 'de' | 'en'` per scenario in `SCENARIOS` + small string map used across participant-facing components (InfoHub already shows the pattern).

### ☐ H-5 · Info Hub defaults to the wrong scenario and wrong level
- `joinSession()` never sets `selectedScenario` (`RoleContext.jsx:44-46`); info pages use `defaultLevel` (= master for energy-transition), so bachelor students read the master briefing.
- **Fix:** on join, store the session's scenario and `education_level`; info pages prefer them.

### ☐ H-6 · No participant management on the facilitator dashboard
- `FacilitatorDashboard.jsx:88-93`, `ParticipantList.jsx` — read-only. Cannot move a student to another group, remove a mistyped/duplicate entry. Combined with C-2/H-1, mistakes are permanent from the facilitator's seat.
- **Fix:** per-row "Move to…" and "Remove" actions; realtime already propagates to the student's view.

## Medium

### ☐ M-1 · Stale localStorage shows another/old session's role
- `RoleContext.jsx:16-25` — scans all `participant-*` keys, takes the first; keys are never pruned (`leaveSession` is never called from UI). On shared devices or in the second course of the semester, "My Role" points at the old session.
- **Fix:** store `lastSessionCode` explicitly, prefer it; prune keys for dead sessions on join.

### ☐ M-2 · Content wiring: triple manual registration, drift already happened
- Adding a group touches `stakeholders.js` + `contentLoader.js` (24 import lines for energy-transition) + the md file; typos fail only at student-runtime. CLAUDE.md documents talstadt level `standard`, code uses `bachelor`. `file:` fields in SCENARIOS are dead.
- **Fix:** `import.meta.glob('../content/*/*/{roles,shared,facilitator}/*.md', { query: '?raw' })`, derive keys from paths (keeps lazy loading, deletes ~60 lines); normalize energy-transition filenames to group ids; sync CLAUDE.md.

### ☐ M-3 · No error boundary — a render error white-screens the class
- **Fix:** boundary in `Layout.jsx` with a reload fallback.

### ☐ M-4 · Wide markdown tables unreadable on phones
- `MarkdownRenderer.jsx:6` — Talstadt key-facts tables collapse to one-word columns on 375 px.
- **Fix:** wrap `table` in `overflow-x-auto` via the `components` override.

### ☐ M-5 · Small classroom UX batch
- Removed participant is silently re-registered, possibly into a different group (`ParticipantView.jsx:50-55`) → show a reason on the join page.
- No banner when the facilitator closes the session mid-simulation (ParticipantView ignores `session.status`).
- No name length cap (`maxLength={30}` + whitespace collapse).
- No join link/QR next to the session code on the dashboard.

### ☐ M-6 · Stale sessions accumulate forever
- **Fix:** pg_cron cleanup (e.g. > 90 days) + "delete all closed" bulk action; scope per facilitator after C-1.

## Low

- ☐ L-1 Accessibility: Accordion lacks `aria-expanded`; labels not linked to inputs; errors lack `role="alert"`; `text-slate-400` hints below AA contrast; `index.html` hard-codes `lang="en"`; nav touch targets ~36 px.
- ☐ L-2 Mobile input attrs on code field (`autoCapitalize="characters"` etc.); parse pasted full URLs.
- ☐ L-3 Duplication: `BackButton` exists but 5 pages inline the SVG; loading spinner + "not found" blocks duplicated ~10×; `MATERIAL_META`/`CONTENT_META` duplicated.
- ☐ L-4 Hook inconsistencies: `useSession` applies realtime payloads, others refetch; `updateStatus` failure is silent on the dashboard; `useAllSessions` subscribes to all participants globally.
- ☐ L-5 Dead code / naming: `STAKEHOLDER_GROUPS` shim unused; `package.json` name `stakeholder-temp`; `education_level`/`level` naming mix; scattered `|| 'energy-transition'` fallbacks; level copy hardcoded in `CreateSession.jsx:156-157`; `FacilitatorRoles.jsx:31` shows all 8 role cards regardless of `active_groups`; `colorClasses` needs a fallback.
- ☐ L-6 Docs drift: CLAUDE.md says React 18 / talstadt `standard`; code has React 19.2, router 7, `bachelor`.

## What already works well (keep)

- Session codes exclude I/O/0/1; Landing sanitizes input.
- QR deep links `/join/:code` short-circuit correctly when already joined.
- Realtime subscriptions correctly scoped and cleaned up; no XSS surface (names render as JSX text, markdown is bundled, not user input).
- Markdown is code-split via dynamic import — no eager-bundle problem.
- Accordion-based phone-first reading structure; role card lengths reasonable.

## SaaS notes (step 3 preview)

The `contentLoader(scenario, level, key)` abstraction is the right seam — for SaaS only its backing store changes (DB/Storage instead of bundled md). Blockers: no tenancy column, no auth (C-1), content compiled into the bundle, language/level semantics hardcoded per scenario id (M-2, L-5).
