// Dynamic content loader with scenario support

const contentModules = {
  'energy-transition': {
    bachelor: {
      roles: {
        management: () => import('../content/energy-transition/bachelor/roles/01_PowerShift_Management_RoleCard.md?raw'),
        workers: () => import('../content/energy-transition/bachelor/roles/02_Workers_Union_RoleCard.md?raw'),
        community: () => import('../content/energy-transition/bachelor/roles/03_Community_Coalition_RoleCard.md?raw'),
        environmental: () => import('../content/energy-transition/bachelor/roles/04_Environmental_Alliance_RoleCard.md?raw'),
        government: () => import('../content/energy-transition/bachelor/roles/05_Regional_Government_RoleCard.md?raw'),
        indigenous: () => import('../content/energy-transition/bachelor/roles/06_Indigenous_Community_RoleCard.md?raw'),
        investors: () => import('../content/energy-transition/bachelor/roles/07_Investor_Coalition_RoleCard.md?raw'),
        technical: () => import('../content/energy-transition/bachelor/roles/08_Technical_Expert_Panel_RoleCard.md?raw'),
      },
      shared: {
        situationBriefing: () => import('../content/energy-transition/bachelor/shared/situation-briefing.md?raw'),
        keyFacts: () => import('../content/energy-transition/bachelor/shared/key-facts-reference.md?raw'),
        schedule: () => import('../content/energy-transition/bachelor/shared/simulation-instructions.md?raw'),
        debriefing: () => import('../content/energy-transition/bachelor/shared/debriefing-questions.md?raw'),
      }
    },
    master: {
      roles: {
        management: () => import('../content/energy-transition/master/roles/01_PowerShift_Management_RoleCard.md?raw'),
        workers: () => import('../content/energy-transition/master/roles/02_Workers_Union_RoleCard.md?raw'),
        community: () => import('../content/energy-transition/master/roles/03_Community_Coalition_RoleCard.md?raw'),
        environmental: () => import('../content/energy-transition/master/roles/04_Environmental_Alliance_RoleCard.md?raw'),
        government: () => import('../content/energy-transition/master/roles/05_Regional_Government_RoleCard.md?raw'),
        indigenous: () => import('../content/energy-transition/master/roles/06_Indigenous_Community_RoleCard.md?raw'),
        investors: () => import('../content/energy-transition/master/roles/07_Investor_Coalition_RoleCard.md?raw'),
        technical: () => import('../content/energy-transition/master/roles/08_Technical_Expert_Panel_RoleCard.md?raw'),
      },
      shared: {
        situationBriefing: () => import('../content/energy-transition/master/shared/situation-briefing.md?raw'),
        keyFacts: () => import('../content/energy-transition/master/shared/key-facts-reference.md?raw'),
        schedule: () => import('../content/energy-transition/master/shared/simulation-instructions.md?raw'),
        debriefing: () => import('../content/energy-transition/master/shared/debriefing-questions.md?raw'),
      }
    }
  },
  'talstadt': {
    standard: {
      roles: {
        stadtrat: () => import('../content/talstadt/standard/roles/stadtrat.md?raw'),
        umweltschutzamt: () => import('../content/talstadt/standard/roles/umweltschutzamt.md?raw'),
        papierfabrik: () => import('../content/talstadt/standard/roles/papierfabrik.md?raw'),
        lackierfabrik: () => import('../content/talstadt/standard/roles/lackierfabrik.md?raw'),
        fremdenverkehrsverein: () => import('../content/talstadt/standard/roles/fremdenverkehrsverein.md?raw'),
        anglerclub: () => import('../content/talstadt/standard/roles/anglerclub.md?raw'),
      },
      shared: {
        situationBriefing: () => import('../content/talstadt/standard/shared/situation-briefing.md?raw'),
        keyFacts: () => import('../content/talstadt/standard/shared/key-facts-reference.md?raw'),
        schedule: () => import('../content/talstadt/standard/shared/simulation-instructions.md?raw'),
        debriefing: () => import('../content/talstadt/standard/shared/debriefing-questions.md?raw'),
      }
    }
  }
};

export async function loadRoleContent(scenario, level, roleId) {
  const effectiveScenario = scenario || 'energy-transition';
  const effectiveLevel = level || (contentModules[effectiveScenario] ? Object.keys(contentModules[effectiveScenario])[0] : 'master');
  const loader = contentModules[effectiveScenario]?.[effectiveLevel]?.roles[roleId];

  if (!loader) {
    throw new Error(`Role ${roleId} not found for scenario ${effectiveScenario}, level ${effectiveLevel}`);
  }

  const module = await loader();
  return module.default;
}

export async function loadSharedContent(scenario, level, contentKey) {
  const effectiveScenario = scenario || 'energy-transition';
  const effectiveLevel = level || (contentModules[effectiveScenario] ? Object.keys(contentModules[effectiveScenario])[0] : 'master');
  const loader = contentModules[effectiveScenario]?.[effectiveLevel]?.shared[contentKey];

  if (!loader) {
    throw new Error(`Shared content ${contentKey} not found for scenario ${effectiveScenario}, level ${effectiveLevel}`);
  }

  const module = await loader();
  return module.default;
}

export async function loadAllSessionContent(scenario, level, roleId) {
  const effectiveScenario = scenario || 'energy-transition';
  const effectiveLevel = level || (contentModules[effectiveScenario] ? Object.keys(contentModules[effectiveScenario])[0] : 'master');

  const [roleMarkdown, situationBriefing, keyFacts, schedule] = await Promise.all([
    loadRoleContent(effectiveScenario, effectiveLevel, roleId),
    loadSharedContent(effectiveScenario, effectiveLevel, 'situationBriefing'),
    loadSharedContent(effectiveScenario, effectiveLevel, 'keyFacts'),
    loadSharedContent(effectiveScenario, effectiveLevel, 'schedule'),
  ]);

  return { roleMarkdown, situationBriefing, keyFacts, schedule };
}
