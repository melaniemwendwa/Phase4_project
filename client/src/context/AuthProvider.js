import React, { createContext, useState, useEffect } from 'react';
import { getCurrentUser as _getCurrentUser, setCurrentUser as _setCurrentUser, clearCurrentUser as _clearCurrentUser } from '../auth';

export const AuthContext = createContext({ user: null, setUser: () => {}, clearUser: () => {} });

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(null);

  useEffect(() => {
    const u = _getCurrentUser();
    if (u) setUserState(u);
  }, []);

  function setUser(user) {
    _setCurrentUser(user);
    setUserState(user);
  }

  function clearUser() {
    _clearCurrentUser();
    setUserState(null);
  }

  return (
    <AuthContext.Provider value={{ user, setUser, clearUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
