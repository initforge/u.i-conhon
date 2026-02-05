import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// API base URL
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const AUTH_STORAGE_KEY = 'conhon_auth_user';
const TOKEN_STORAGE_KEY = 'conhon_token';

export interface User {
  id: string;
  phone: string;
  name: string | null;
  zalo?: string;
  role: 'user' | 'admin';
  bank_code?: string;
  bank_account?: string;
  bank_holder?: string;
  completed_tasks?: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (phone: string, password: string) => Promise<User | null>;
  register: (data: { phone: string; password: string; name: string; zalo: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load user and token from localStorage on init
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  });

  // Save to localStorage whenever user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  }, [token]);

  // Real API login - returns user object or null
  const login = async (phone: string, password: string): Promise<User | null> => {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // Save token immediately to localStorage for API calls
        localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data.user));

        // Also update React state
        setToken(data.token);
        setUser(data.user);
        return data.user; // Return user for immediate role checking
      }
      return null;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  };


  // Real API register
  const register = async (data: { phone: string; password: string; name: string; zalo: string }): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.token) {
        setToken(result.token);
        setUser(result.user);
        return { success: true };
      }
      return { success: false, error: result.error || 'Đăng ký thất bại' };
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error: 'Lỗi kết nối server' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...data });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        isAuthenticated: !!user && !!token,
        isAdmin: user?.role === 'admin',
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
