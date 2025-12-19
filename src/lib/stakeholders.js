export const STAKEHOLDER_GROUPS = {
  management: {
    id: 'management',
    name: 'PowerShift Energy Management',
    emoji: '🏢',
    color: 'blue',
    order: 1,
    file: '01_PowerShift_Management_RoleCard.md'
  },
  workers: {
    id: 'workers',
    name: 'Coal Plant Workers Union',
    emoji: '👷',
    color: 'amber',
    order: 2,
    file: '02_Workers_Union_RoleCard.md'
  },
  community: {
    id: 'community',
    name: 'Local Community Coalition',
    emoji: '🏘️',
    color: 'emerald',
    order: 3,
    file: '03_Community_Coalition_RoleCard.md'
  },
  environmental: {
    id: 'environmental',
    name: 'Environmental Alliance',
    emoji: '🌿',
    color: 'green',
    order: 4,
    file: '04_Environmental_Alliance_RoleCard.md'
  },
  government: {
    id: 'government',
    name: 'Regional Government',
    emoji: '🏛️',
    color: 'purple',
    order: 5,
    file: '05_Regional_Government_RoleCard.md'
  },
  indigenous: {
    id: 'indigenous',
    name: 'Indigenous Community',
    emoji: '🪶',
    color: 'orange',
    order: 6,
    file: '06_Indigenous_Community_RoleCard.md'
  },
  investors: {
    id: 'investors',
    name: 'Investor Coalition',
    emoji: '💼',
    color: 'slate',
    order: 7,
    file: '07_Investor_Coalition_RoleCard.md'
  },
  technical: {
    id: 'technical',
    name: 'Technical Expert Panel',
    emoji: '🔬',
    color: 'cyan',
    order: 8,
    file: '08_Technical_Expert_Panel_RoleCard.md'
  }
};

export const getStakeholderById = (id) => STAKEHOLDER_GROUPS[id];

export const getOrderedStakeholders = () =>
  Object.values(STAKEHOLDER_GROUPS).sort((a, b) => a.order - b.order);
