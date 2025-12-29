// Dynamic content loader for Bachelor and Master levels

const contentModules = {
  bachelor: {
    roles: {
      management: () => import('../content/bachelor/roles/01_PowerShift_Management_RoleCard.md?raw'),
      workers: () => import('../content/bachelor/roles/02_Workers_Union_RoleCard.md?raw'),
      community: () => import('../content/bachelor/roles/03_Community_Coalition_RoleCard.md?raw'),
      environmental: () => import('../content/bachelor/roles/04_Environmental_Alliance_RoleCard.md?raw'),
      government: () => import('../content/bachelor/roles/05_Regional_Government_RoleCard.md?raw'),
      indigenous: () => import('../content/bachelor/roles/06_Indigenous_Community_RoleCard.md?raw'),
      investors: () => import('../content/bachelor/roles/07_Investor_Coalition_RoleCard.md?raw'),
      technical: () => import('../content/bachelor/roles/08_Technical_Expert_Panel_RoleCard.md?raw'),
    },
    shared: {
      situationBriefing: () => import('../content/bachelor/shared/situation-briefing.md?raw'),
      keyFacts: () => import('../content/bachelor/shared/key-facts-reference.md?raw'),
      schedule: () => import('../content/bachelor/shared/simulation-instructions.md?raw'),
      debriefing: () => import('../content/bachelor/shared/debriefing-questions.md?raw'),
    }
  },
  master: {
    roles: {
      management: () => import('../content/master/roles/01_PowerShift_Management_RoleCard.md?raw'),
      workers: () => import('../content/master/roles/02_Workers_Union_RoleCard.md?raw'),
      community: () => import('../content/master/roles/03_Community_Coalition_RoleCard.md?raw'),
      environmental: () => import('../content/master/roles/04_Environmental_Alliance_RoleCard.md?raw'),
      government: () => import('../content/master/roles/05_Regional_Government_RoleCard.md?raw'),
      indigenous: () => import('../content/master/roles/06_Indigenous_Community_RoleCard.md?raw'),
      investors: () => import('../content/master/roles/07_Investor_Coalition_RoleCard.md?raw'),
      technical: () => import('../content/master/roles/08_Technical_Expert_Panel_RoleCard.md?raw'),
    },
    shared: {
      situationBriefing: () => import('../content/master/shared/situation-briefing.md?raw'),
      keyFacts: () => import('../content/master/shared/key-facts-reference.md?raw'),
      schedule: () => import('../content/master/shared/simulation-instructions.md?raw'),
      debriefing: () => import('../content/master/shared/debriefing-questions.md?raw'),
    }
  }
};

export async function loadRoleContent(level, roleId) {
  const effectiveLevel = level || 'master';
  const loader = contentModules[effectiveLevel]?.roles[roleId];

  if (!loader) {
    throw new Error(`Role ${roleId} not found for level ${effectiveLevel}`);
  }

  const module = await loader();
  return module.default;
}

export async function loadSharedContent(level, contentKey) {
  const effectiveLevel = level || 'master';
  const loader = contentModules[effectiveLevel]?.shared[contentKey];

  if (!loader) {
    throw new Error(`Shared content ${contentKey} not found for level ${effectiveLevel}`);
  }

  const module = await loader();
  return module.default;
}

export async function loadAllSessionContent(level, roleId) {
  const effectiveLevel = level || 'master';

  const [roleMarkdown, situationBriefing, keyFacts, schedule] = await Promise.all([
    loadRoleContent(effectiveLevel, roleId),
    loadSharedContent(effectiveLevel, 'situationBriefing'),
    loadSharedContent(effectiveLevel, 'keyFacts'),
    loadSharedContent(effectiveLevel, 'schedule'),
  ]);

  return { roleMarkdown, situationBriefing, keyFacts, schedule };
}
