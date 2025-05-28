import React, { createContext, useState, useMemo } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser || storedUser === "undefined") return null;
      return JSON.parse(storedUser);
    } catch (err) {
      console.error("Error parsing stored user:", err);
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('token');
  });

  const login = (userData, token) => {
     console.log('Logging in user data:', userData);
    setUser(userData);
    setToken(token);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = useMemo(() => {
    const authHeaders = () => ({
      Authorization: `Bearer ${token}`,
    });

    return { user, token, login, logout, authHeaders };
  }, [user, token]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
