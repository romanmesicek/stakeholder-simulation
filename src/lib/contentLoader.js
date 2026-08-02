// Content loader: discovers all markdown under src/content/ via glob, so a
// new scenario/level/role only needs its files and a SCENARIOS entry — no
// import wiring. Files stay lazily loaded (one chunk per file).
//
// Conventions:
//   roles/<groupId>.md                 — role card per stakeholder group
//   shared/situation-briefing.md       — key "situationBriefing"
//   shared/key-facts-reference.md      — key "keyFacts"
//   shared/simulation-instructions.md  — key "schedule"
//   shared/debriefing-questions.md     — key "debriefing"
//   facilitator/<kebab-name>.md        — key is the camelCased file name

import { SCENARIOS } from './stakeholders';

const modules = import.meta.glob('../content/*/*/{roles,shared,facilitator}/*.md', {
  query: '?raw',
  import: 'default',
});

const SHARED_FILES = {
  situationBriefing: 'situation-briefing',
  keyFacts: 'key-facts-reference',
  schedule: 'simulation-instructions',
  debriefing: 'debriefing-questions',
};

const camelCase = (kebab) => kebab.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
const kebabCase = (camel) => camel.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

const modulePath = (scenario, level, kind, fileName) =>
  `../content/${scenario}/${level}/${kind}/${fileName}.md`;

function firstAvailableLevel(scenario) {
  const prefix = `../content/${scenario}/`;
  for (const path of Object.keys(modules)) {
    if (path.startsWith(prefix)) {
      return path.slice(prefix.length).split('/')[0];
    }
  }
  return 'master';
}

async function load(scenario, level, kind, fileName, description) {
  const effectiveScenario = scenario || 'energy-transition';
  const effectiveLevel = level || firstAvailableLevel(effectiveScenario);
  const loader = modules[modulePath(effectiveScenario, effectiveLevel, kind, fileName)];

  if (!loader) {
    throw new Error(`${description} not found for scenario ${effectiveScenario}, level ${effectiveLevel}`);
  }
  return loader();
}

export function loadRoleContent(scenario, level, roleId) {
  return load(scenario, level, 'roles', roleId, `Role ${roleId}`);
}

export function loadSharedContent(scenario, level, contentKey) {
  const fileName = SHARED_FILES[contentKey];
  if (!fileName) {
    return Promise.reject(new Error(`Unknown shared content key ${contentKey}`));
  }
  return load(scenario, level, 'shared', fileName, `Shared content ${contentKey}`);
}

export function loadFacilitatorContent(scenario, level, contentKey) {
  return load(scenario, level, 'facilitator', kebabCase(contentKey), `Facilitator content ${contentKey}`);
}

export function getFacilitatorMaterials(scenario, level) {
  const effectiveScenario = scenario || 'energy-transition';
  const effectiveLevel = level || firstAvailableLevel(effectiveScenario);
  const prefix = `../content/${effectiveScenario}/${effectiveLevel}/facilitator/`;
  return Object.keys(modules)
    .filter(path => path.startsWith(prefix))
    .map(path => camelCase(path.slice(prefix.length).replace(/\.md$/, '')));
}

export async function loadAllSessionContent(scenario, level, roleId) {
  const [roleMarkdown, situationBriefing, keyFacts, schedule] = await Promise.all([
    loadRoleContent(scenario, level, roleId),
    loadSharedContent(scenario, level, 'situationBriefing'),
    loadSharedContent(scenario, level, 'keyFacts'),
    loadSharedContent(scenario, level, 'schedule'),
  ]);

  return { roleMarkdown, situationBriefing, keyFacts, schedule };
}

// Dev-only sanity check: every group in SCENARIOS must have a role card,
// every level the four shared files. Typos then fail at `npm run dev`
// startup instead of when a student opens their role in class.
if (import.meta.env.DEV) {
  for (const scenario of Object.values(SCENARIOS)) {
    for (const level of scenario.levels) {
      for (const key of Object.values(SHARED_FILES)) {
        if (!modules[modulePath(scenario.id, level, 'shared', key)]) {
          console.warn(`[contentLoader] Missing shared file: ${scenario.id}/${level}/shared/${key}.md`);
        }
      }
      for (const group of Object.values(scenario.groups)) {
        if (group.levels.includes(level) && !modules[modulePath(scenario.id, level, 'roles', group.id)]) {
          console.warn(`[contentLoader] Missing role card: ${scenario.id}/${level}/roles/${group.id}.md`);
        }
      }
    }
  }
}
