'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth`,
  withCredentials: true
});

interface AuthContextType {
  isLoggedIn: boolean;
  userRole: 'student' | 'staff' | null;
  userEmail: string | null;
  login: (role: 'student' | 'staff', email: string) => void;
  logout: () => void;
  switchRole: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'student' | 'staff' | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedRole = localStorage.getItem('userRole');
    const savedEmail = localStorage.getItem('userEmail');
    if (savedRole) {
      setUserRole(savedRole as 'student' | 'staff');
      setUserEmail(savedEmail);
      setIsLoggedIn(true);
      setIsLoading(false);
    } else {
      setIsLoading(false);
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
    <AuthContext.Provider value={{ isLoggedIn, userRole, userEmail, login, logout, switchRole, isLoading }}>
      {!isLoading && children}
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