import { createContext } from 'react';

// Shared context object, kept in its own file so RoleContext.jsx exports only
// the provider component (react-refresh/only-export-components).
export const RoleContext = createContext(null);
