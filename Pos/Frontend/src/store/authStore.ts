import { create } from 'zustand';

interface AuthState {
  token: string | null;
  restaurant: {
    id: string;
    name: string;
    slug: string;
    email: string;
  } | null;
  isAuthenticated: boolean;
  login: (token: string, restaurant: any) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  const savedToken = localStorage.getItem('pos_token');
  const savedRestaurant = localStorage.getItem('pos_restaurant');

  return {
    token: savedToken,
    restaurant: savedRestaurant ? JSON.parse(savedRestaurant) : null,
    isAuthenticated: !!savedToken,
    login: (token, restaurant) => {
      localStorage.setItem('pos_token', token);
      localStorage.setItem('pos_restaurant', JSON.stringify(restaurant));
      set({ token, restaurant, isAuthenticated: true });
    },
    logout: () => {
      localStorage.removeItem('pos_token');
      localStorage.removeItem('pos_restaurant');
      set({ token: null, restaurant: null, isAuthenticated: false });
    },
  };
});
export default useAuthStore;
