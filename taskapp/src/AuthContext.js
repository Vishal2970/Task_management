import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAdmin, setIsAdmin] = useState(
    sessionStorage.getItem('isAdmin') === 'true'
  );

  // Sync token from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }, []);

  // Login function
  const login = (newToken, adminStatus = false) => {
    localStorage.setItem('token', newToken);
    sessionStorage.setItem('isAdmin', adminStatus); 
    setToken(newToken);
    setIsAdmin(adminStatus);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('isAdmin');
    setToken(null);
    setIsAdmin(false);
  };

  const setAdminStatus = (status) => {
    sessionStorage.setItem('isAdmin', status);
    setIsAdmin(status);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, isAdmin, setAdminStatus }}>
      {children}
    </AuthContext.Provider>
  );
};
