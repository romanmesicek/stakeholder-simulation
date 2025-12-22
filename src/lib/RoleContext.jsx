import { createContext, useContext, useState, useEffect } from 'react';
import { getStakeholderById } from './stakeholders';

const RoleContext = createContext(null);

export function RoleProvider({ children }) {
  const [selectedRoleId, setSelectedRoleId] = useState(() => {
    return localStorage.getItem('selectedRole') || null;
  });

  // Track active session from localStorage
  const [activeSessionCode, setActiveSessionCode] = useState(() => {
    // Check localStorage for any participant-* keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('participant-')) {
        return key.replace('participant-', '');
      }
    }
    return null;
  });

  useEffect(() => {
    if (selectedRoleId) {
      localStorage.setItem('selectedRole', selectedRoleId);
    } else {
      localStorage.removeItem('selectedRole');
    }
  }, [selectedRoleId]);

  const selectedRole = selectedRoleId ? getStakeholderById(selectedRoleId) : null;

  // Function to join a session (called from JoinSession)
  const joinSession = (sessionCode) => {
    setActiveSessionCode(sessionCode);
  };

  // Function to leave a session
  const leaveSession = () => {
    if (activeSessionCode) {
      localStorage.removeItem(`participant-${activeSessionCode}`);
    }
    setActiveSessionCode(null);
  };

  return (
    <RoleContext.Provider value={{
      selectedRole,
      selectedRoleId,
      setSelectedRoleId,
      activeSessionCode,
      joinSession,
      leaveSession
    }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
