import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../mock-data/mockData';

interface AuthContextType {
  user: User | null;
  login: (phone: string, password: string) => boolean;
  loginAsDemo: (role: 'user' | 'admin') => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (phone: string, password: string): boolean => {
    // Mock login - in Phase 2 this will call API
    // For now, just check if phone matches demo users
    if (phone === '0901234567' || phone === '0332697909') {
      const mockUser = phone === '0332697909' 
        ? { id: 'admin-1', phone: '0332697909', name: 'Admin', zaloName: 'Cổ Nhơn An Nhơn', role: 'admin' as const }
        : { id: 'user-1', phone: '0901234567', name: 'Nguyễn Văn A', zaloName: 'Anh Văn', role: 'user' as const };
      setUser(mockUser);
      return true;
    }
    return false;
  };

  const loginAsDemo = (role: 'user' | 'admin') => {
    if (role === 'admin') {
      setUser({
        id: 'admin-1',
        phone: '0332697909',
        name: 'Admin',
        zaloName: 'Cổ Nhơn An Nhơn',
        role: 'admin',
        bankAccount: {
          accountNumber: '9876543210',
          accountHolder: 'CO NHON AN NHON',
          bankName: 'Techcombank',
        },
      });
    } else {
      setUser({
        id: 'user-1',
        phone: '0901234567',
        name: 'Nguyễn Văn A',
        zaloName: 'Anh Văn',
        role: 'user',
        bankAccount: {
          accountNumber: '1234567890',
          accountHolder: 'NGUYEN VAN A',
          bankName: 'Vietcombank',
        },
      });
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        loginAsDemo,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
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

