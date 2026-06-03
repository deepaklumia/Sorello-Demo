export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category: string;
}

export interface CartItem {
  id?: string;
  menuItem: MenuItem;
  quantity: number;
  customizations?: string;
}

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  customizations?: string;
}

export type OrderStatus = 'pending' | 'ready' | 'completed' | 'overdue';

export interface Order {
  id: string;
  customerName: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: OrderStatus;
  createdAt: string; // ISO String
  paymentMethod?: 'cash' | 'card';
  timer?: string; // e.g. "05:20 Overdue" or "02:15"
}
