# Stakeholder Simulation - Claude Context

## Project Overview

A web-based platform for multi-stakeholder negotiation simulations, designed for educational settings. Participants take on different stakeholder roles and negotiate solutions to complex real-world problems.

**Live:** https://stakeholder-simulation.suska.app/

## Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS
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
- Talstadt: **Standard** (single level)

### Sessions
- Created by facilitators with a unique 6-character code
- Facilitator selects scenario, level, and active groups
- Participants join via code and are auto-assigned to stakeholder groups
- Sessions have `open` or `closed` status
- Realtime updates via Supabase subscriptions

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
│       └── /standard/roles|shared
├── /hooks            # Custom React hooks
│   ├── useSession.js       # Single session data
│   ├── useAllSessions.js   # All sessions for facilitator
│   └── useParticipants.js  # Realtime participant list
├── /lib              # Utilities
│   ├── supabase.js         # Supabase client
│   ├── stakeholders.js     # SCENARIOS object + utility functions
│   ├── contentLoader.js    # Dynamic content loading (scenario → level → content)
│   ├── sessionUtils.js     # Session code generation
│   └── RoleContext.jsx     # Participant role + scenario state
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
  education_level TEXT,          -- 'bachelor', 'master', 'standard', etc.
  active_groups TEXT[] NOT NULL, -- which groups are enabled
  max_per_group INTEGER DEFAULT 4,
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

Content is loaded dynamically via `contentLoader.js` with 3 parameters: scenario, level, contentKey/roleId:

```javascript
// Load role content
await loadRoleContent('energy-transition', 'master', 'workers');
await loadRoleContent('talstadt', 'standard', 'stadtrat');

// Load shared content
await loadSharedContent('energy-transition', 'bachelor', 'situationBriefing');
await loadSharedContent('talstadt', 'standard', 'keyFacts');
```

Content keys for shared content:
- `situationBriefing` - Case overview
- `keyFacts` - Quick reference facts
- `schedule` - Simulation timeline
- `debriefing` - Post-simulation questions

## Environment Variables

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Common Tasks

### Add a new scenario
1. Add entry in `SCENARIOS` in `src/lib/stakeholders.js` (~15 lines)
2. Create content folder `src/content/new-scenario/{level}/roles|shared/`
3. Add imports in `contentModules` in `src/lib/contentLoader.js`
4. No further files needed — CreateSession reads `getScenariosArray()` dynamically

### Add a new stakeholder group to existing scenario
1. Add entry in `SCENARIOS[scenario].groups` in `src/lib/stakeholders.js`
2. Create role card markdown in scenario's content folder
3. Add import to `contentLoader.js`

### Modify content for a scenario/level
Edit files in `src/content/{scenario}/{level}/`

## Testing Locally

```bash
npm install
npm run dev
```

Requires Supabase project with tables created (see README.md for SQL).
