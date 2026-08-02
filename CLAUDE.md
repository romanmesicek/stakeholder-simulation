# Stakeholder Simulation - Claude Context

## Project Overview

A web-based platform for multi-stakeholder negotiation simulations, designed for educational settings. Participants take on different stakeholder roles and negotiate solutions to complex real-world problems.

**Live:** https://stakeholder-simulation.suska.app/

## Tech Stack

- **Frontend**: React 19 + Vite + Tailwind CSS
- **Routing**: React Router DOM
- **Markdown**: react-markdown + remark-gfm
- **Backend**: Supabase (PostgreSQL + Realtime subscriptions)
- **Deployment**: Vercel

## Key Concepts

### Scenarios
The platform supports multiple scenarios, each with its own stakeholder groups and content:
- **Energy Transition** (`energy-transition`): Coal plant phase-out negotiation, 8 groups, bachelor/master levels
- **Umweltverschmutzung in Talstadt** (`talstadt`): Environmental pollution conflict in a small German town, 6 groups, single level

### Levels
Each scenario can have one or more difficulty levels:
- Energy Transition: **Bachelor** (6 groups, simplified) and **Master** (8 groups, full complexity)
- Talstadt: single level, stored as `bachelor` in the DB (displayed as "Standard")

Level labels/badges/descriptions come from `levelMeta` in each `SCENARIOS` entry.

### Sessions
- Created by facilitators with a unique 6-character code
- Facilitator selects scenario, level, and active groups
- Participants join via code; the `join_session()` Postgres RPC assigns groups atomically (enforces `max_per_group`, priority tie-break)
- Sessions have `open` or `closed` status; closed sessions still allow rejoin-by-name
- Realtime updates via Supabase subscriptions

### Facilitator keys (no login)
Each session gets a random owner key, generated in the browser on creation and stored in localStorage (`facilitator-keys`). The DB stores only its SHA-256 hash. Close/reopen/delete and participant move/remove go through `SECURITY DEFINER` RPCs that check the key. The dashboard shows the key for transfer to other devices; `/facilitate` lists only sessions whose keys are present on the device (plus an import form). RLS allows anonymous clients read-only access; all writes go through RPCs (see `supabase/migrations/`).

### Stakeholder Groups

**Energy Transition** (8 groups):
1. PowerShift Energy Management (company)
2. Coal Plant Workers Union (workers)
3. Local Community Coalition (residents)
4. Environmental Alliance (climate advocates)
5. Regional Government (authorities)
6. Indigenous Community (indigenous people)
7. Investor Coalition (shareholders)
8. Technical Expert Panel (advisors)

**Talstadt** (6 groups):
1. Stadtrat (city council)
2. Amt für Umweltschutz (environmental office)
3. Leitung der Papierfabrik (paper factory)
4. Leitung der Lackierfabrik (paint factory)
5. Fremdenverkehrsverein (tourism association)
6. Anglerclub (fishing club)

## Project Structure

```
/src
├── /components       # Reusable UI components
├── /content          # Markdown content by scenario → level
│   ├── /energy-transition
│   │   ├── /bachelor/roles|shared
│   │   └── /master/roles|shared
│   └── /talstadt
│       └── /bachelor/roles|shared|facilitator
├── /hooks            # Custom React hooks
│   ├── useSession.js       # Single session data
│   ├── useAllSessions.js   # Facilitator's sessions (keys in localStorage)
│   └── useParticipants.js  # Realtime participant list
├── /lib              # Utilities
│   ├── supabase.js         # Supabase client
│   ├── stakeholders.js     # SCENARIOS object + utility functions
│   ├── contentLoader.js    # Glob-based markdown loading (scenario → level → content)
│   ├── i18n.js             # Participant-facing UI strings per scenario language
│   ├── facilitatorKeys.js  # Owner keys in localStorage
│   ├── materialMeta.js     # Facilitator material labels
│   ├── sessionUtils.js     # Session code generation
│   └── RoleContext.jsx     # Participant role + scenario/level state
└── /pages            # Route components
```

## Key Routes

| Route | Purpose |
|-------|---------|
| `/` | Landing page |
| `/create` | Create new session (facilitator) |
| `/join/:code` | Join session (participant) |
| `/session/:code` | Participant view with role |
| `/facilitate` | Facilitator home - all sessions |
| `/facilitate/:code` | Dashboard for specific session |
| `/info/*` | Info hub with case materials |

## Database Schema

```sql
-- Sessions table
sessions (
  id TEXT PRIMARY KEY,           -- 6-char code
  status TEXT DEFAULT 'open',    -- 'open' or 'closed'
  scenario TEXT NOT NULL DEFAULT 'energy-transition',
  education_level TEXT,          -- 'bachelor' or 'master'
  active_groups TEXT[] NOT NULL, -- which groups are enabled
  max_per_group INTEGER DEFAULT 4,
  owner_key_hash TEXT,           -- SHA-256 of the facilitator key
  created_at TIMESTAMPTZ
)

-- Participants table
participants (
  id UUID PRIMARY KEY,
  session_id TEXT REFERENCES sessions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  stakeholder_group TEXT NOT NULL,
  joined_at TIMESTAMPTZ
)
```

## Content System

`contentLoader.js` discovers all markdown under `src/content/` via `import.meta.glob` — no import wiring. File conventions per `src/content/{scenario}/{level}/`:

- `roles/<groupId>.md` — role card, file name must equal the group id in `SCENARIOS`
- `shared/situation-briefing.md` → key `situationBriefing`
- `shared/key-facts-reference.md` → key `keyFacts`
- `shared/simulation-instructions.md` → key `schedule`
- `shared/debriefing-questions.md` → key `debriefing`
- `facilitator/<kebab-name>.md` → key is the camelCased file name (e.g. `eventCards`)

```javascript
await loadRoleContent('energy-transition', 'master', 'workers');
await loadRoleContent('talstadt', 'bachelor', 'stadtrat');
await loadSharedContent('talstadt', 'bachelor', 'keyFacts');
```

In dev mode the loader warns at startup about missing role/shared files (`[contentLoader]` in the console).

## Environment Variables

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Common Tasks

### Add a new scenario
1. Add entry in `SCENARIOS` in `src/lib/stakeholders.js` (incl. `language`, `keyFactsLabel`, `levelMeta`)
2. Create content folder `src/content/new-scenario/{level}/roles|shared/` following the file conventions above
3. Done — the loader discovers the files, CreateSession reads `getScenariosArray()` dynamically

### Add a new stakeholder group to existing scenario
1. Add entry in `SCENARIOS[scenario].groups` in `src/lib/stakeholders.js`
2. Create `roles/<groupId>.md` in the scenario's content folder for each level

### Modify content for a scenario/level
Edit files in `src/content/{scenario}/{level}/`

## Reviews & Open Todos

Two consolidated reviews (August 2026) track findings and remaining work — check them before starting improvement work, and tick items off there when done:

- `docs/code-review-2026-08.md` — code/UX/security review (step 1, largely done; remaining: session cleanup, hook consistency, Supabase Auth for SaaS)
- `docs/content-review-2026-08.md` — case-content & didactics review (step 2; package 1 "errors & facts" done, packages 2 "negotiation logic" and 3 "didactics & facilitator" are the open todo list)

## Testing Locally

```bash
npm install
npm run dev
```

Requires Supabase project with tables created (see README.md for SQL).
