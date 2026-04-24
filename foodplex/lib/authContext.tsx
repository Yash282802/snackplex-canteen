'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  userRole: 'student' | 'staff' | null;
  userEmail: string | null;
  login: (role: 'student' | 'staff', email: string) => void;
  logout: () => void;
  switchRole: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'student' | 'staff' | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const savedRole = localStorage.getItem('userRole');
    const savedEmail = localStorage.getItem('userEmail');
    if (savedRole) {
      setUserRole(savedRole as 'student' | 'staff');
      setUserEmail(savedEmail);
      setIsLoggedIn(true);
    }
  }, []);

  const login = (role: 'student' | 'staff', email: string) => {
    setUserRole(role);
    setUserEmail(email);
    setIsLoggedIn(true);
    localStorage.setItem('userRole', role);
    localStorage.setItem('userEmail', email);
  };

  const logout = () => {
    setUserRole(null);
    setUserEmail(null);
    setIsLoggedIn(false);
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
  };

  const switchRole = () => {
    const newRole = userRole === 'student' ? 'staff' : 'student';
    setUserRole(newRole);
    localStorage.setItem('userRole', newRole);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userRole, userEmail, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}