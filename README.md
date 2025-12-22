# Stakeholder Simulation

**Live Demo:** https://stakeholder-simulation-energy-transition.vercel.app/

A web-based platform for multi-stakeholder negotiation simulations. Participants take on different roles with competing interests and work to find common ground on complex real-world issues.

## About

Stakeholder simulations are powerful learning tools that help participants:
- Understand diverse perspectives and interests
- Practice negotiation and diplomacy skills
- Experience the complexity of real-world decision-making
- Build empathy for positions different from their own

## Current Case: Energy Transition

The included case explores the challenges of transitioning from coal to renewable energy. Eight stakeholder groups must negotiate a transition plan:

| Group | Represents |
|-------|------------|
| PowerShift Energy Management | Company leadership |
| Coal Plant Workers Union | 500 plant workers |
| Local Community Coalition | Affected residents |
| Environmental Alliance | Climate advocates |
| Regional Government | Public authorities |
| Indigenous Community | Local indigenous people |
| Investor Coalition | Shareholders |
| Technical Expert Panel | Independent advisors |

## Features

- **Session Management**: Create sessions with unique 6-character codes
- **Auto-Assignment**: Participants are automatically assigned to stakeholder groups
- **Realtime Updates**: Live participant list updates via Supabase
- **Facilitator Dashboard**: Monitor and manage active sessions
- **Role Cards**: Detailed stakeholder information for each group
- **Info Hub**: Case briefing, schedule, and reference materials
- **Mobile-Friendly**: Responsive design for all devices

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- React Router DOM
- react-markdown with remark-gfm
- Supabase (Database & Realtime)

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Supabase

Create a Supabase project at https://supabase.com and run this SQL in the SQL Editor:

```sql
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed')),
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

CREATE POLICY "Allow all for sessions" ON sessions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for participants" ON participants FOR ALL USING (true) WITH CHECK (true);
```

### 3. Environment Variables

Create a `.env.local` file:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

For production (Vercel), add these as environment variables in the project settings.

### 4. Run Development Server

```bash
npm run dev
```

## Session Management

### For Facilitators

1. Go to **Manage Sessions** (`/facilitate`)
2. View all sessions (open and closed)
3. Create new sessions with **+ New Session**
4. Delete sessions directly from the list (with confirmation)

### Deleting Sessions

Sessions can be deleted in two ways:

**Via the App (recommended):**
1. Go to `/facilitate`
2. Click the trash icon next to a session
3. Confirm deletion

**Via Supabase Dashboard:**
1. Open your project at https://supabase.com/dashboard
2. Go to **Table Editor** → **sessions**
3. Select row(s) and click **Delete**

Participants are automatically deleted with their session (`ON DELETE CASCADE`).

### Is Deleting Necessary?

No. Old sessions don't affect new ones. Delete when:
- Testing during development
- Privacy requirements after workshops
- General database cleanup

## Project Structure

```
/src
├── /components    # UI components
├── /hooks         # Custom React hooks
├── /pages         # Route pages
├── /content       # Markdown content
│   ├── /roles     # Stakeholder role cards
│   └── /shared    # Case materials
└── /lib           # Supabase client & utilities
```
