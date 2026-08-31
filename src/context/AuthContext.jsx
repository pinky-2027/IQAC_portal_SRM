import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const getInitialUser = () => {
    try {
      const savedUser = localStorage.getItem('iqac_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  };

  const [user, setUser] = useState(getInitialUser());
  const [token, setToken] = useState(localStorage.getItem('iqac_token'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('iqac_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        // preserve state
      }
    }
  }, []);

  const login = async (username, password, departmentId = null) => {
    try {
      const res = await apiService.login(username, password, departmentId);
      if (res && res.access_token && res.user) {
        localStorage.setItem('iqac_token', res.access_token);
        localStorage.setItem('iqac_user', JSON.stringify(res.user));
        setToken(res.access_token);
        setUser(res.user);
        return res.user;
      }
    } catch (backendErr) {
      console.warn('Backend login fallback to local session auth:', backendErr);
    }
    return user;
  };

  const setUserSession = (userObj, tokenStr) => {
    const activeToken = tokenStr || 'demo_token_' + userObj.id;
    localStorage.setItem('iqac_token', activeToken);
    localStorage.setItem('iqac_user', JSON.stringify(userObj));
    setToken(activeToken);
    setUser(userObj);
  };

  const logout = () => {
    localStorage.removeItem('iqac_token');
    localStorage.removeItem('iqac_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, setUserSession, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
