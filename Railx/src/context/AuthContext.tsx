"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorageContext } from './LocalStorageContext';
import { Passenger, LoginCredentials, RegisterData, AuthContextType } from '@/types';
import { useRouter } from 'next/navigation';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Passenger | null>(null);
  const [loading, setLoading] = useState(true);
  const { profile, updateProfile, resetProfile } = useLocalStorageContext();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = profile?.token;
      if (token) {
        try {
          const response = await fetch("http://localhost:5001/api/auth/me", {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            resetProfile();
          }
        } catch (error) {
          resetProfile();
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, [profile?.token, resetProfile]);

  const login = async (credentials: LoginCredentials) => {
    const response = await fetch("http://localhost:5001/api/auth/login", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const data = await response.json();
    updateProfile({ token: data.token, user: data.user });
    setUser(data.user);
    router.push('/dashboard');
  };

  const register = async (data: RegisterData) => {
    const response = await fetch("http://localhost:5001/api/auth/register", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    const result = await response.json();
    updateProfile({ token: result.token, user: result.user });
    setUser(result.user);
    router.push('/dashboard');
  };

  const logout = async () => {
    const token = profile?.token;
    if (token) {
      await fetch("http://localhost:5001/api/auth/logout", {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    }
    resetProfile();
    setUser(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}