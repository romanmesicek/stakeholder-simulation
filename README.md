# Stakeholder Simulation

**Live:** https://stakeholder-simulation.suska.app/

A web-based platform for multi-stakeholder negotiation simulations. Participants take on different roles with competing interests and work to find common ground on complex real-world issues.

## About

Stakeholder simulations are powerful learning tools that help participants:
- Understand diverse perspectives and interests
- Practice negotiation and diplomacy skills
- Experience the complexity of real-world decision-making
- Build empathy for positions different from their own

## Scenarios

### Energy Transition (English)

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

Supports two levels: **Bachelor** (6 groups, simplified) and **Master** (8 groups, full complexity).

### Umweltverschmutzung in Talstadt (Deutsch)

Ein Planspiel zu Umweltkonflikten in einer Kleinstadt. Sechs Interessengruppen verhandeln über Umweltschutz vs. wirtschaftliche Interessen:

| Gruppe | Vertritt |
|--------|----------|
| Stadtrat | Kommunalpolitik |
| Amt für Umweltschutz | Umweltbehörde |
| Leitung der Papierfabrik | Fabrikleitung (500 Beschäftigte) |
| Leitung der Lackierfabrik | Fabrikleitung (200 Beschäftigte) |
| Fremdenverkehrsverein | Tourismusbranche |
| Anglerclub | Naturschutz / Angler |

Single level: **Standard**.

## Features

- **Multi-Scenario Support**: Multiple cases with independent stakeholder groups and content
- **Session Management**: Create sessions with unique 6-character codes
- **Auto-Assignment**: Participants are automatically assigned to stakeholder groups
- **Realtime Updates**: Live participant list updates via Supabase
- **Facilitator Dashboard**: Monitor and manage active sessions
- **Bilingual UI**: English for Energy Transition, German for Talstadt
- **Role Cards**: Detailed stakeholder information for each group
- **Info Hub**: Case briefing, schedule, and reference materials
- **Debriefing Guides**: Structured post-simulation discussion questions
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

## Adding a New Scenario

1. Add entry to `SCENARIOS` in `src/lib/stakeholders.js`
2. Create content folder `src/content/new-scenario/{level}/roles|shared/`
3. Add imports in `contentModules` in `src/lib/contentLoader.js`
4. No further files needed — CreateSession picks it up dynamically

## Project Structure

```
/src
├── /components    # UI components
├── /hooks         # Custom React hooks (useSession, useParticipants, etc.)
├── /pages         # Route pages
├── /content       # Markdown content by scenario
│   ├── /energy-transition
│   │   ├── /bachelor/roles|shared
│   │   └── /master/roles|shared
│   └── /talstadt
│       └── /standard/roles|shared
└── /lib           # Supabase client, utilities, context
```
