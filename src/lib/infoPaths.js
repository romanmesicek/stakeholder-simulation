import { useParams } from 'react-router-dom';
import { SCENARIOS } from './stakeholders';

// Info hub URLs carry case and level in the path, so every page knows its
// level and a facilitator can share an exact pre-reading link.
export const infoPath = (scenario, level, sub) =>
  `/info/${scenario}/${level}${sub ? `/${sub}` : ''}`;

export const isValidInfoTarget = (scenario, level) =>
  Boolean(SCENARIOS[scenario]?.levels.includes(level));

// Reads :scenario/:level from the route; `valid` is false for unknown cases
// or levels the case doesn't have (pages then redirect to /info).
export function useInfoParams() {
  const { scenario, level } = useParams();
  return { scenario, level, valid: isValidInfoTarget(scenario, level) };
}

// Per-scenario labels for the overview cards (in the scenario's language).
const INFO_LABELS = {
  'energy-transition': {
    hubTitle: 'Information Hub',
    case: { title: 'The Case', description: 'Read the full situation briefing and background' },
    schedule: { title: 'Schedule', description: 'Simulation phases and process steps' },
    stakeholders: { title: 'Stakeholder Groups', description: 'Overview of the stakeholder groups' },
    reference: { title: 'Reference Materials', description: 'Key facts and reference information' },
  },
  'talstadt': {
    hubTitle: 'Informationen',
    case: { title: 'Die Fallstudie', description: 'Hintergrund und Ausgangssituation in Talstadt' },
    schedule: { title: 'Spielablauf', description: 'Phasen und Hinweise zum Planspiel' },
    stakeholders: { title: 'Interessengruppen', description: 'Übersicht der Gruppen im Planspiel' },
    reference: { title: 'Informationsmaterialien', description: 'Fakten, Gutachten und Gesetze' },
  },
  'data-centers': {
    hubTitle: 'Information Hub',
    case: { title: 'The Case', description: 'The Falkenberg situation briefing and background' },
    schedule: { title: 'Schedule', description: 'Simulation phases and the permit rules' },
    stakeholders: { title: 'Stakeholder Groups', description: 'Overview of the stakeholder groups' },
    reference: { title: 'Key Facts & Reference', description: 'The shared fact sheet all parties can cite, and contest' },
  },
};

export const getInfoLabels = (scenario) => INFO_LABELS[scenario] || INFO_LABELS['energy-transition'];
