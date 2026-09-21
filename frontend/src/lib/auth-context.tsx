'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { api } from './api';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export type UserRole = 'STUDENT' | 'MENTOR' | 'PARENT' | 'RECRUITER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  xp: number;
  level: number;
  streak: number;
  headline?: string;
  bio?: string;
  avatarUrl?: string;
  quizCompleted: boolean;
}

export function getRoleHomeRoute(role?: UserRole, quizCompleted?: boolean): string {
  if (role === 'MENTOR') return '/mentor';
  if (role === 'PARENT') return '/parent';
  if (role === 'RECRUITER') return '/recruiter';
  if (role === 'STUDENT' && quizCompleted === false) return '/quiz';
  return '/dashboard';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (token: string) => Promise<User | null>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  getRoleHome: () => string;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
  login: async () => null,
  logout: () => {},
  refreshUser: async () => {},
  getRoleHome: () => '/dashboard',
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadUser = async (): Promise<User | null> => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (token) {
        const userData = await api.auth.me();
        if (userData && userData.id) {
          setUser(userData);
          return userData;
        } else {
          console.warn('Invalid user data returned from /auth/me');
          setUser(null);
          return null;
        }
      } else {
        setUser(null);
        return null;
      }
    } catch (error: any) {
      console.error('loadUser error:', error);
      // ONLY clear token if backend explicitly returned a 401 Unauthorized status
      if (error?.status === 401 || error?.message?.toLowerCase().includes('unauthorized')) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
        setUser(null);
      } else {
        console.warn('Transient error in loadUser; retaining session token:', error?.message);
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (token: string): Promise<User | null> => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
    const fetchedUser = await loadUser();
    return fetchedUser;
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    setUser(null);
    router.push('/login');
    toast.success('Logged out successfully');
  };

  const getRoleHome = () => getRoleHomeRoute(user?.role, user?.quizCompleted);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshUser: async () => { await loadUser(); },
        getRoleHome,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
