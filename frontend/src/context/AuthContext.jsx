import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedAdmin = localStorage.getItem('admin');
    const storedToken = localStorage.getItem('token');
    if (storedAdmin && storedToken) {
      setAdmin(JSON.parse(storedAdmin));
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const loginAdmin = (adminData, tokenData) => {
    setAdmin(adminData);
    setToken(tokenData);
    localStorage.setItem('admin', JSON.stringify(adminData));
    localStorage.setItem('token', tokenData);
  };

  const logoutAdmin = () => {
    setAdmin(null);
    setToken(null);
    localStorage.removeItem('admin');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ admin, token, loading, loginAdmin, logoutAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
