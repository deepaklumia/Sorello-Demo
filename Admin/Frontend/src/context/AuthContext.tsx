import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';

export interface RestaurantProfile {
  id: string;
  name: string;
  slug: string;
  email: string;
  phone?: string;
  address?: string;
  status?: string;
  subscriptionPlan?: string;
}

interface AuthContextType {
  token: string | null;
  restaurant: RestaurantProfile | null;
  isAuthenticated: boolean;
  login: (token: string, restaurant: RestaurantProfile, keepSession: boolean) => void;
  updateProfileState: (updated: Partial<RestaurantProfile>) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [restaurant, setRestaurant] = useState<RestaurantProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/restaurant/profile');
      setRestaurant(response.data);
    } catch (e) {
      console.error('Failed to validate active session:', e);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedToken = localStorage.getItem('restaurant_token') || sessionStorage.getItem('restaurant_token');
    const savedUser = localStorage.getItem('restaurant_user') || sessionStorage.getItem('restaurant_user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        setRestaurant(JSON.parse(savedUser));
        // Verify token with backend
        fetchProfile();
      } catch (e) {
        logout();
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const login = (newToken: string, newRestaurant: RestaurantProfile, keepSession: boolean) => {
    setToken(newToken);
    setRestaurant(newRestaurant);

    const storage = keepSession ? localStorage : sessionStorage;
    storage.setItem('restaurant_token', newToken);
    storage.setItem('restaurant_user', JSON.stringify(newRestaurant));
    storage.setItem('restaurant_slug', newRestaurant.slug);
  };

  const updateProfileState = (updated: Partial<RestaurantProfile>) => {
    if (restaurant) {
      const merged = { ...restaurant, ...updated };
      setRestaurant(merged);

      const storage = localStorage.getItem('restaurant_token') ? localStorage : sessionStorage;
      storage.setItem('restaurant_user', JSON.stringify(merged));
    }
  };

  const logout = () => {
    setToken(null);
    setRestaurant(null);

    const slug = localStorage.getItem('restaurant_slug') || sessionStorage.getItem('restaurant_slug') || 'burger-palace';

    localStorage.removeItem('restaurant_token');
    localStorage.removeItem('restaurant_user');
    localStorage.removeItem('restaurant_slug');
    sessionStorage.removeItem('restaurant_token');
    sessionStorage.removeItem('restaurant_user');
    sessionStorage.removeItem('restaurant_slug');

    if (typeof window !== 'undefined') {
      window.location.href = `/${slug}`;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        restaurant,
        isAuthenticated: !!token,
        login,
        updateProfileState,
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
export default AuthContext;
