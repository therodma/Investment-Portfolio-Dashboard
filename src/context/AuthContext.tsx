import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (name: string, email: string, pass: string, profile?: Partial<User>) => Promise<void>;
  loginDemo: () => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<User>;
  openAuthModal: (mode?: 'login' | 'signup') => void;
  authModalOpen: boolean;
  authMode: 'login' | 'signup';
  closeAuthModal: () => void;
  accountModalOpen: boolean;
  openAccountModal: () => void;
  closeAccountModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('portfolio_token'));
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [accountModalOpen, setAccountModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const existingToken = localStorage.getItem('portfolio_token');
    if (existingToken) {
      setToken(existingToken);
      api.getCurrentUser()
        .then((u) => {
          setUser(u);
        })
        .catch(() => {
          // If token is invalid or expired, clear it
          localStorage.removeItem('portfolio_token');
          setToken(null);
          setUser(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
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

  const signup = async (name: string, email: string, pass: string, profile?: Partial<User>) => {
    setLoading(true);
    try {
      const res = await api.signup(name, email, pass, profile);
      setUser(res.user);
      setToken(res.token);
      localStorage.setItem('portfolio_token', res.token);
      setAuthModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const loginDemo = async () => {
    setLoading(true);
    try {
      const res = await api.login('investor@example.com', 'password123');
      setUser(res.user);
      setToken(res.token);
      localStorage.setItem('portfolio_token', res.token);
      setAuthModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<User> => {
    const updated = await api.updateProfile(updates);
    setUser(updated);
    return updated;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('portfolio_token');
    setAccountModalOpen(false);
  };

  const openAuthModal = (mode: 'login' | 'signup' = 'login') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const openAccountModal = () => {
    setAccountModalOpen(true);
  };

  const closeAccountModal = () => {
    setAccountModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        signup,
        loginDemo,
        logout,
        updateProfile,
        openAuthModal,
        authModalOpen,
        authMode,
        closeAuthModal,
        accountModalOpen,
        openAccountModal,
        closeAccountModal
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
