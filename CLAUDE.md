# Stakeholder Simulation - Claude Context

## Project Overview

A web-based platform for multi-stakeholder negotiation simulations, designed for educational settings. Participants take on different stakeholder roles and negotiate solutions to complex real-world problems.

**Live:** https://stakeholder-simulation-energy-transition.vercel.app/

## Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Routing**: React Router DOM
- **Markdown**: react-markdown + remark-gfm
- **Backend**: Supabase (PostgreSQL + Realtime subscriptions)
- **Deployment**: Vercel

## Key Concepts

### Levels
The simulation supports two difficulty levels:
- **Bachelor**: 6 stakeholder groups, simplified content, shorter debriefing
- **Master**: 8 stakeholder groups, full complexity content, structured debriefing

### Sessions
- Created by facilitators with a unique 6-character code
- Participants join via code and are auto-assigned to stakeholder groups
- Sessions have `open` or `closed` status
- Realtime updates via Supabase subscriptions

### Stakeholder Groups
8 groups representing different interests in an energy transition scenario:
1. PowerShift Energy Management (company)
2. Coal Plant Workers Union (workers)
3. Local Community Coalition (residents)
4. Environmental Alliance (climate advocates)
5. Regional Government (authorities)
6. Indigenous Community (indigenous people)
7. Investor Coalition (shareholders)
8. Technical Expert Panel (advisors)

## Project Structure

```
/src
├── /components       # Reusable UI components
├── /content          # Markdown content by level
│   ├── /bachelor     # Simplified content
│   │   ├── /roles    # 8 role cards
│   │   └── /shared   # Case, schedule, debriefing
│   └── /master       # Full complexity content
│       ├── /roles    # 8 role cards
│       └── /shared   # Case, schedule, debriefing
├── /hooks            # Custom React hooks
│   ├── useSession.js       # Single session data
│   ├── useAllSessions.js   # All sessions for facilitator
│   └── useParticipants.js  # Realtime participant list
├── /lib              # Utilities
│   ├── supabase.js         # Supabase client
│   ├── stakeholders.js     # Stakeholder definitions
│   ├── contentLoader.js    # Dynamic content loading
│   ├── sessionUtils.js     # Session code generation
│   └── RoleContext.jsx     # Participant role state
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

Content is loaded dynamically via `contentLoader.js`:

```javascript
// Load role content for a specific level
await loadRoleContent('master', 'workers');

// Load shared content (case briefing, schedule, etc.)
await loadSharedContent('bachelor', 'situationBriefing');
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

### Add a new stakeholder group
1. Add entry in `src/lib/stakeholders.js`
2. Create role card markdown in both `bachelor/roles/` and `master/roles/`
3. Add import to `contentLoader.js`

### Modify content for a level
Edit files in `src/content/bachelor/` or `src/content/master/`

### Add a new shared content type
1. Create markdown file in `shared/` directories
2. Add loader to `contentLoader.js`
3. Create page component and route

## Testing Locally

```bash
npm install
npm run dev
```

Requires Supabase project with tables created (see README.md for SQL).
