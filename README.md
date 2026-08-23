# Stakeholder Simulation

**Live:** https://stakeholder-simulation.suska.app/

A web-based platform for multi-stakeholder negotiation simulations, designed for educational settings. Facilitators create sessions, participants join via a code, get assigned to a stakeholder group, and negotiate solutions to complex real-world problems — all from their phones or laptops.

The platform is scenario-agnostic: any negotiation case with multiple stakeholder groups can be added. The UI adapts language and content to the selected scenario.

## How It Works

```
Facilitator creates session     Participants join via code     Groups negotiate
┌─────────────────────┐         ┌───────────────────┐         ┌──────────────────┐
│ 1. Pick scenario    │         │ 1. Enter code     │         │ - Read role card  │
│ 2. Pick level       │  ────>  │ 2. Enter name     │  ────>  │ - View case brief │
│ 3. Select groups    │         │ 3. Auto-assigned   │         │ - See your team   │
│ 4. Share code       │         │    to a group      │         │ - Use materials   │
└─────────────────────┘         └───────────────────┘         └──────────────────┘
```

## Included Scenarios

The platform ships with three ready-to-use scenarios. New scenarios can be added with minimal code changes (see below).

### Energy Transition (English)

A coal plant phase-out negotiation. 8 stakeholder groups with competing interests — workers, management, environmentalists, investors, government, indigenous community, local residents, and technical experts — must agree on a transition plan. Supports **Bachelor** (6 groups, simplified) and **Master** (8 groups, full complexity) levels.

### Umweltverschmutzung in Talstadt (Deutsch)

Ein Planspiel zu Umweltkonflikten in einer Kleinstadt. Zwei Fabriken verschmutzen Luft und Wasser, sechs Interessengruppen — Stadtrat, Umweltbehörde, beide Fabrikl­eitungen, Fremdenverkehrsverein und Anglerclub — verhandeln über Lösungen. Ein Level: **Bachelor**.

### The Falkenberg Data Center (English)

A hyperscale data center siting negotiation, distilled from real European conflicts (Kronstorf, Dublin, Zeewolde, Frankfurt, the Nordic waste-heat successes, Aragón). 8 stakeholder groups — the cloud company, municipal council, citizens' initiative, environmental NGO, grid operator, development agency, farmers, and the permitting authority — negotiate whether and under which binding conditions the campus gets built. One level: **Master** (~4 hours).

## Features

- **Multi-Scenario**: Any number of negotiation cases, each with its own groups, content, and language
- **Facilitator Dashboard**: Create sessions, monitor groups, access debriefing guides
- **Facilitator Toolkit**: Per scenario and level — event cards, role overview with deal-space notes, observation sheet, common-problems playbook, assessment rubric
- **Access Gate**: The facilitator area and full foreign role cards sit behind a shared access code (per-device unlock)
- **Realtime**: Live participant list via Supabase subscriptions
- **Auto-Assignment**: Participants are evenly distributed across stakeholder groups
- **Multi-Level Content**: Scenarios can have multiple difficulty levels (e.g. Bachelor/Master)
- **Bilingual**: UI labels adapt to the scenario language (English, German, ...)
- **Role Cards**: Each group gets detailed background, goals, actions, negotiation tips
- **Info Hub**: Case briefing, schedule, reference materials, stakeholder overview
- **Mobile-Friendly**: Designed for participants on phones

## Tech Stack

- **Frontend**: React 19 + Vite + Tailwind CSS
- **Routing**: React Router DOM
- **Content**: Markdown files rendered with react-markdown + remark-gfm
- **Backend**: Supabase (PostgreSQL + Realtime subscriptions)
- **Deployment**: Vercel

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Supabase

Create a Supabase project at https://supabase.com and run this SQL:

```sql
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  scenario TEXT NOT NULL DEFAULT 'energy-transition',
  education_level TEXT NOT NULL DEFAULT 'master',
  active_groups TEXT[] NOT NULL,
  max_per_group INTEGER DEFAULT 4,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  stakeholder_group TEXT NOT NULL,
  joined_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_participants_session ON participants(session_id);

ALTER PUBLICATION supabase_realtime ADD TABLE participants;
ALTER PUBLICATION supabase_realtime ADD TABLE sessions;

ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
```

Then run the migrations in `supabase/migrations/` (SQL Editor, in file order). The most important one is `2026-08-02_owner_key_and_atomic_join.sql`: it adds facilitator owner keys, the atomic `join_session()` group assignment, and the RLS policies (anonymous clients may only read; all writes go through `SECURITY DEFINER` functions).

Facilitators authenticate through a per-session **facilitator key**: generated in the browser on session creation, stored in localStorage, and shown on the session dashboard so it can be transferred to another device. Without the key, a session can be viewed but not closed, deleted, or edited.

### 3. Environment Variables

Create a `.env.local` file:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run

```bash
npm run dev
```

## Adding a New Scenario

The architecture is designed so new scenarios require no structural changes:

1. **Define groups** — add an entry to `SCENARIOS` in `src/lib/stakeholders.js` (incl. `language`, `keyFactsLabel`, `levelMeta`)
2. **Write content** — create `src/content/{scenario-id}/{level}/roles/` and `shared/`; role files are named `<groupId>.md`, shared files follow the fixed names (`situation-briefing.md`, `key-facts-reference.md`, `simulation-instructions.md`, `debriefing-questions.md`)
3. **Optional facilitator materials** — add `facilitator/*.md` per level (e.g. `event-cards.md`, `role-overview.md`, `observation-sheet.md`, `common-problems.md`, `assessment-rubric.md`); each file type needs a matching key in `MATERIAL_META` (`src/lib/materialMeta.js`)
4. **Info hub labels** — add an entry to the `labels` object in `src/pages/InfoHub.jsx`; without it, the hub silently falls back to the English energy-transition labels

That's it. The content loader discovers the files via glob; the create-session UI, participant views, info hub, and facilitator dashboard all pick up the new scenario automatically.

## Session Management

### For Facilitators

1. Go to `/facilitate` and unlock it once per device with the **facilitator access code** (ask the platform operator; to change it, replace the SHA-256 hash in `src/lib/facilitatorAccess.js` — the plain code is never committed)
2. Create a session: pick scenario, level, groups, max participants per group
3. Share the 6-character code with participants
4. Monitor the live participant list on the dashboard
5. Use the debriefing guide after the simulation

### For Participants

1. Go to the link or enter the code on the landing page
2. Enter your name
3. You're auto-assigned to a stakeholder group
4. Read your role card, case briefing, and reference materials
5. Negotiate!

## Project Structure

```
/src
├── /components       # Reusable UI (Accordion, ParticipantList, RoleCard, ...)
├── /content          # Markdown content, organized by scenario
│   ├── /energy-transition
│   │   ├── /bachelor/roles|shared|facilitator
│   │   └── /master/roles|shared|facilitator
│   └── /talstadt
│       └── /bachelor/roles|shared|facilitator
├── /hooks            # useSession, useParticipants, useAllSessions
├── /lib
│   ├── stakeholders.js       # SCENARIOS object — groups, metadata, utility functions
│   ├── contentLoader.js      # Glob-based markdown loading: scenario → level → content
│   ├── i18n.js               # Participant-facing UI strings per scenario language
│   ├── facilitatorKeys.js    # Per-session owner keys in localStorage
│   ├── facilitatorAccess.js  # Shared access-code gate for the facilitator area
│   ├── materialMeta.js       # Labels/descriptions for facilitator material types
│   ├── RoleContext.jsx       # Global state for selected role + scenario/level
│   ├── supabase.js           # Supabase client
│   └── sessionUtils.js       # Session code generation
└── /pages            # Route components (CreateSession, ParticipantView, InfoHub, ...)
```
