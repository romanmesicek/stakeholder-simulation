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

- Role cards with detailed stakeholder information
- Case briefing and background materials
- Simulation schedule and process guide
- Role-playing tips and negotiation guidance
- Mobile-friendly design

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- React Router DOM
- react-markdown with remark-gfm

## Getting Started

```bash
npm install
npm run dev
```

## Project Structure

```
/src
├── /components    # UI components
├── /pages         # Route pages
├── /content       # Markdown content
│   ├── /roles     # Stakeholder role cards
│   └── /shared    # Case materials
└── /lib           # Configuration
```
