import { useState, useEffect } from 'react';
import { getStakeholderById } from './stakeholders';
import { getScenarioLanguage } from './i18n';
import { RoleContext } from './roleContextObject';

// Find a session code with a stored participant id, preferring the most
// recently joined one so "My Role" never points at last week's session.
function findActiveSessionCode() {
  const lastCode = localStorage.getItem('lastSessionCode');
  if (lastCode && localStorage.getItem(`participant-${lastCode}`)) {
    return lastCode;
  }
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('participant-')) {
      return key.replace('participant-', '');
    }
  }
  return null;
}

export function RoleProvider({ children }) {
  const [selectedRoleId, setSelectedRoleId] = useState(() => {
    return localStorage.getItem('selectedRole') || null;
  });

  const [selectedScenario, setSelectedScenario] = useState(() => {
    return localStorage.getItem('selectedScenario') || 'energy-transition';
  });

  // Level of the session the user joined (bachelor/master); info pages
  // prefer this over the scenario's defaultLevel.
  const [selectedLevel, setSelectedLevel] = useState(() => {
    return localStorage.getItem('selectedLevel') || null;
  });

  const [activeSessionCode, setActiveSessionCode] = useState(findActiveSessionCode);

  useEffect(() => {
    if (selectedRoleId) {
      localStorage.setItem('selectedRole', selectedRoleId);
    } else {
      localStorage.removeItem('selectedRole');
    }
  }, [selectedRoleId]);

  useEffect(() => {
    if (selectedScenario) {
      localStorage.setItem('selectedScenario', selectedScenario);
    }
  }, [selectedScenario]);

  useEffect(() => {
    if (selectedLevel) {
      localStorage.setItem('selectedLevel', selectedLevel);
    } else {
      localStorage.removeItem('selectedLevel');
    }
  }, [selectedLevel]);

  // Keep the document language in sync so screen readers pronounce
  // German scenarios correctly.
  useEffect(() => {
    document.documentElement.lang = getScenarioLanguage(selectedScenario);
  }, [selectedScenario]);

  const selectedRole = selectedRoleId ? getStakeholderById(selectedRoleId, selectedScenario) : null;

  // Called from JoinSession after a successful join/rejoin. Adopts the
  // session's scenario + level and prunes participant ids of other sessions
  // so stale entries can't hijack "My Role" on shared devices.
  const joinSession = (sessionCode, scenario, level) => {
    const staleKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('participant-') && key !== `participant-${sessionCode}`) {
        staleKeys.push(key);
      }
    }
    staleKeys.forEach(key => localStorage.removeItem(key));

    localStorage.setItem('lastSessionCode', sessionCode);
    setActiveSessionCode(sessionCode);
    if (scenario) setSelectedScenario(scenario);
    if (level) setSelectedLevel(level);
  };

  // Function to leave a session
  const leaveSession = () => {
    if (activeSessionCode) {
      localStorage.removeItem(`participant-${activeSessionCode}`);
    }
    localStorage.removeItem('lastSessionCode');
    setActiveSessionCode(null);
  };

  return (
    <RoleContext.Provider value={{
      selectedRole,
      selectedRoleId,
      setSelectedRoleId,
      selectedScenario,
      setSelectedScenario,
      selectedLevel,
      setSelectedLevel,
      activeSessionCode,
      joinSession,
      leaveSession
    }}>
      {children}
    </RoleContext.Provider>
  );
}
