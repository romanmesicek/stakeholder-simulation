# Energy Transition Simulation

A multi-stakeholder negotiation simulation exploring the complexities of transitioning from coal to renewable energy.

## Overview

This web application supports an educational simulation where participants take on different stakeholder roles to negotiate an energy transition plan. The simulation involves 8 stakeholder groups with competing interests and priorities.

## Stakeholder Groups

- **PowerShift Energy Management** - The company leading the transition
- **Coal Plant Workers Union** - Representing employee interests
- **Local Community Coalition** - Residents affected by the transition
- **Environmental Alliance** - Advocating for climate action
- **Regional Government** - Balancing economic and environmental concerns
- **Indigenous Community** - Protecting cultural and land rights
- **Investor Coalition** - Focused on financial returns
- **Technical Expert Panel** - Providing scientific guidance

## Features (Phase 1)

- Browse simulation information and case description
- Access quick reference facts and figures
- View simulation schedule and process
- Explore all 8 stakeholder role cards

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- React Router DOM
- react-markdown with remark-gfm

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
/src
├── /components    # Reusable UI components
├── /pages         # Route pages
├── /content       # Markdown content files
│   ├── /roles     # 8 stakeholder role cards
│   └── /shared    # Case, reference, schedule
└── /lib           # Configuration and utilities
```

## Routes

| Path | Description |
|------|-------------|
| `/` | Landing page |
| `/info` | Information hub |
| `/info/case` | Situation briefing |
| `/info/reference` | Quick reference facts |
| `/info/schedule` | Simulation schedule |
| `/info/roles` | All stakeholder roles |
| `/info/roles/:id` | Individual role detail |
