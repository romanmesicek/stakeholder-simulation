import { createContext, useContext, useState, useEffect } from 'react';
import { getStakeholderById } from './stakeholders';

const RoleContext = createContext(null);

export function RoleProvider({ children }) {
  const [selectedRoleId, setSelectedRoleId] = useState(() => {
    return localStorage.getItem('selectedRole') || null;
  });

  useEffect(() => {
    if (selectedRoleId) {
      localStorage.setItem('selectedRole', selectedRoleId);
    } else {
      localStorage.removeItem('selectedRole');
    }
  }, [selectedRoleId]);

  const selectedRole = selectedRoleId ? getStakeholderById(selectedRoleId) : null;

  return (
    <RoleContext.Provider value={{ selectedRole, selectedRoleId, setSelectedRoleId }}>
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
