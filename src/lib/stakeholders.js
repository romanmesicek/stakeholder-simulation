export const SCENARIOS = {
  'energy-transition': {
    id: 'energy-transition',
    name: 'Energy Transition',
    description: 'Coal plant phase-out negotiation',
    language: 'en',
    keyFactsLabel: '🎭 Staying in Role',
    levels: ['bachelor', 'master'],
    defaultLevel: 'master',
    groups: {
      management: {
        id: 'management',
        name: 'PowerShift Energy Management',
        emoji: '🏢',
        color: 'blue',
        order: 1,
        priority: 1,
        file: '01_PowerShift_Management_RoleCard.md',
        levels: ['bachelor', 'master'],
        shortDescription: 'Executive leadership team making decisions about transitioning from coal to renewable energy. Control transition timeline, allocate €3 billion budget, and approve all major agreements.'
      },
      workers: {
        id: 'workers',
        name: 'Coal Plant Workers Union',
        emoji: '👷',
        color: 'amber',
        order: 2,
        priority: 2,
        file: '02_Workers_Union_RoleCard.md',
        levels: ['bachelor', 'master'],
        shortDescription: 'Representatives of 500 coal plant workers facing job losses. Fighting for job security, fair severance, retraining programs, and priority hiring for renewable positions.'
      },
      community: {
        id: 'community',
        name: 'Local Community Coalition',
        emoji: '🏘️',
        color: 'emerald',
        order: 3,
        priority: 4,
        file: '03_Community_Coalition_RoleCard.md',
        levels: ['bachelor', 'master'],
        shortDescription: 'Representatives of towns dependent on coal plant tax revenue and jobs. Advocating for economic transition support, local investment, and community development.'
      },
      environmental: {
        id: 'environmental',
        name: 'Environmental Alliance',
        emoji: '🌿',
        color: 'green',
        order: 4,
        priority: 5,
        file: '04_Environmental_Alliance_RoleCard.md',
        levels: ['bachelor', 'master'],
        shortDescription: 'Coalition of environmental groups pushing for fastest possible coal phase-out. Prioritizing climate action, ecosystem protection, and holding polluters accountable.'
      },
      government: {
        id: 'government',
        name: 'Regional Government',
        emoji: '🏛️',
        color: 'purple',
        order: 5,
        priority: 3,
        file: '05_Regional_Government_RoleCard.md',
        levels: ['bachelor', 'master'],
        shortDescription: 'Elected officials balancing economic stability, environmental compliance, and social welfare. Control permits, can offer subsidies, and must maintain public services.'
      },
      indigenous: {
        id: 'indigenous',
        name: 'Indigenous Community',
        emoji: '🪶',
        color: 'orange',
        order: 6,
        priority: 7,
        file: '06_Indigenous_Community_RoleCard.md',
        levels: ['bachelor', 'master'],
        shortDescription: 'Representatives protecting ancestral lands, cultural sites, and water resources near the Southern Plant. Seeking recognition, consultation rights, and environmental restoration.'
      },
      investors: {
        id: 'investors',
        name: 'Investor Coalition',
        emoji: '💼',
        color: 'slate',
        order: 7,
        priority: 6,
        file: '07_Investor_Coalition_RoleCard.md',
        levels: ['bachelor', 'master'],
        shortDescription: 'Institutional investors and pension funds focused on financial returns and ESG compliance. Balancing profitability with sustainable investment criteria.'
      },
      technical: {
        id: 'technical',
        name: 'Technical Expert Panel',
        emoji: '🔬',
        color: 'cyan',
        order: 8,
        priority: 8,
        file: '08_Technical_Expert_Panel_RoleCard.md',
        levels: ['bachelor', 'master'],
        shortDescription: 'Independent engineers and scientists providing technical guidance on grid stability, renewable integration timelines, and environmental assessments.'
      }
    }
  },
  'talstadt': {
    id: 'talstadt',
    name: 'Umweltverschmutzung in Talstadt',
    description: 'Umweltkonflikt in einer Kleinstadt',
    language: 'de',
    keyFactsLabel: '📚 Informationsmaterialien',
    levels: ['bachelor'],
    defaultLevel: 'bachelor',
    groups: {
      stadtrat: {
        id: 'stadtrat',
        name: 'Stadtrat',
        emoji: '🏛️',
        color: 'purple',
        order: 1,
        priority: 1,
        levels: ['bachelor'],
        shortDescription: 'Mitglieder des Stadtrats, die im Interesse der Bürger Politik machen. Setzen sich für Arbeitsplätze und saubere Umwelt ein, damit Talstadts Ruf als Luftkurort keinen Schaden nimmt.'
      },
      umweltschutzamt: {
        id: 'umweltschutzamt',
        name: 'Amt für Umweltschutz',
        emoji: '🛡️',
        color: 'green',
        order: 2,
        priority: 3,
        levels: ['bachelor'],
        shortDescription: 'Zuständige Umweltschutzbehörde für Luftreinhaltung und Gewässerschutz. Überwacht Betriebe, kann Maßnahmen anordnen und Bußgelder verhängen.'
      },
      papierfabrik: {
        id: 'papierfabrik',
        name: 'Leitung der Papierfabrik',
        emoji: '🏭',
        color: 'amber',
        order: 3,
        priority: 2,
        levels: ['bachelor'],
        shortDescription: 'Eigentümerfamilie und Geschäftsführung der Papierfabrik mit 500 Beschäftigten. Familienbesitz seit Generationen. Kämpfen mit Verlusten, wollen den Betrieb aber langfristig erhalten –nicht um jeden Preis verkaufen.'
      },
      lackierfabrik: {
        id: 'lackierfabrik',
        name: 'Leitung der Lackierfabrik',
        emoji: '🎨',
        color: 'blue',
        order: 4,
        priority: 4,
        levels: ['bachelor'],
        shortDescription: 'Angestellter CEO der Lackierfabrik mit 200 Beschäftigten. Stark gewinnorientiert, unter Druck der Eigentümer. Wirtschaftlich erfolgreich, plant Expansion, aber veraltete Filteranlagen verursachen Geruchsbelästigung.'
      },
      fremdenverkehrsverein: {
        id: 'fremdenverkehrsverein',
        name: 'Fremdenverkehrsverein',
        emoji: '🏨',
        color: 'emerald',
        order: 5,
        priority: 5,
        levels: ['bachelor'],
        shortDescription: 'Vorstand des Fremdenverkehrsvereins. Befürchtet, dass Luftverschmutzung und Geruchsbelästigung Kur- und Feriengäste abschrecken.'
      },
      anglerclub: {
        id: 'anglerclub',
        name: 'Anglerclub',
        emoji: '🎣',
        color: 'cyan',
        order: 6,
        priority: 6,
        levels: ['bachelor'],
        shortDescription: 'Vorstand des Anglerclubs mit 49 Mitgliedern. Will die Schwarzach als sauberes Gewässer erhalten und fordert Schadenersatz für das Fischsterben.'
      }
    }
  }
};

// Backward compatibility shim
export const STAKEHOLDER_GROUPS = SCENARIOS['energy-transition'].groups;

export const getScenariosArray = () =>
  Object.values(SCENARIOS);

export const getStakeholderById = (id, scenario = 'energy-transition') =>
  SCENARIOS[scenario]?.groups[id];

export const getOrderedStakeholders = (scenario = 'energy-transition') =>
  Object.values(SCENARIOS[scenario]?.groups || {}).sort((a, b) => a.order - b.order);

export const getStakeholdersForLevel = (level, scenario = 'energy-transition') =>
  Object.values(SCENARIOS[scenario]?.groups || {})
    .filter(s => s.levels.includes(level))
    .sort((a, b) => a.order - b.order);

// Level for info pages: URL param wins, then the level of the session the
// user joined (only if it belongs to this scenario), then the default.
export const resolveLevel = (scenario, urlLevel, joinedScenario, joinedLevel) => {
  const levels = SCENARIOS[scenario]?.levels || [];
  if (urlLevel && levels.includes(urlLevel)) return urlLevel;
  if (joinedLevel && scenario === joinedScenario && levels.includes(joinedLevel)) return joinedLevel;
  return SCENARIOS[scenario]?.defaultLevel || 'master';
};

export const getDefaultGroupsForLevel = (level, scenario = 'energy-transition') => {
  const scenarioData = SCENARIOS[scenario];
  if (!scenarioData) return [];

  if (scenario === 'energy-transition' && level === 'bachelor') {
    return ['management', 'workers', 'community', 'environmental', 'government', 'investors'];
  }
  return Object.keys(scenarioData.groups);
};
