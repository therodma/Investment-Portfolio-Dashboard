import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => void;
  openAuthModal: (mode?: 'login' | 'signup') => void;
  authModalOpen: boolean;
  authMode: 'login' | 'signup';
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>({
    id: 'usr_demo',
    email: 'investor@example.com',
    name: 'Alex Morgan',
    createdAt: new Date().toISOString()
  });
  const [token, setToken] = useState<string | null>(localStorage.getItem('portfolio_token') || 'token_investor@example.com');
  const [loading, setLoading] = useState<boolean>(false);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    const existingToken = localStorage.getItem('portfolio_token');
    if (existingToken) {
      setToken(existingToken);
      api.getCurrentUser()
        .then((u) => setUser(u))
        .catch(() => {
          // keep demo user if backend session check defaults
        });
    }
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const res = await api.login(email, pass);
      setUser(res.user);
      setToken(res.token);
      localStorage.setItem('portfolio_token', res.token);
      setAuthModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, pass: string) => {
    setLoading(true);
    try {
      const res = await api.signup(name, email, pass);
      setUser(res.user);
      setToken(res.token);
      localStorage.setItem('portfolio_token', res.token);
      setAuthModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('portfolio_token');
  };

  const openAuthModal = (mode: 'login' | 'signup' = 'login') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        signup,
        logout,
        openAuthModal,
        authModalOpen,
        authMode,
        closeAuthModal
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
