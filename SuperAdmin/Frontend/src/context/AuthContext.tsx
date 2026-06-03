import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User, keepSession: boolean) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('sorello_token') || sessionStorage.getItem('sorello_token');
    const savedUser = localStorage.getItem('sorello_user') || sessionStorage.getItem('sorello_user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        // Clear invalid data
        localStorage.removeItem('sorello_user');
        sessionStorage.removeItem('sorello_user');
      }
    }
    setLoading(false);
  }, []);

  const login = (newToken: string, newUser: User, keepSession: boolean) => {
    setToken(newToken);
    setUser(newUser);
    const storage = keepSession ? localStorage : sessionStorage;
    storage.setItem('sorello_token', newToken);
    storage.setItem('sorello_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('sorello_token');
    localStorage.removeItem('sorello_user');
    sessionStorage.removeItem('sorello_token');
    sessionStorage.removeItem('sorello_user');
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token,
        login,
        logout,
        loading,
      }}
    >
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
