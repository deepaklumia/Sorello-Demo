import type { MenuItem, Order } from '../types/order';

export const MOCK_MENU: MenuItem[] = [
  {
    id: 'm1',
    name: 'Chicken',
    description: 'Grilled free-range chicken breast seasoned with signature herbs.',
    price: 2.50,
    imageUrl: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=200&auto=format&fit=crop&q=60',
    category: 'Main Courses'
  },
  {
    id: 'm2',
    name: 'Vanilla Milkshake',
    description: 'Classic creamy vanilla milkshake topped with whipped cream.',
    price: 4.50,
    imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=200&auto=format&fit=crop&q=60',
    category: 'Desserts'
  },
  {
    id: 'm3',
    name: 'Classic Burger',
    description: '100% beef patty with cheese, lettuce, tomato, and secret sauce.',
    price: 8.50,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&auto=format&fit=crop&q=60',
    category: 'Main Courses'
  },
  {
    id: 'm4',
    name: 'Crispy Fries',
    description: 'Golden shoestring potatoes seasoned with sea salt.',
    price: 3.00,
    imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200&auto=format&fit=crop&q=60',
    category: 'Sides'
  },
  {
    id: 'm5',
    name: 'Iced Latte',
    description: 'Chilled espresso poured over fresh milk and ice cubes.',
    price: 4.00,
    imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=200&auto=format&fit=crop&q=60',
    category: 'Beverages'
  },
  {
    id: 'm6',
    name: 'Spicy Chicken Wings',
    description: 'Crispy wings tossed in buffalo sauce, served with ranch.',
    price: 12.00,
    imageUrl: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=200&auto=format&fit=crop&q=60',
    category: 'Sides'
  },
  {
    id: 'm7',
    name: 'Truffle Fries',
    description: 'Crispy fries drizzled with white truffle oil and parmesan.',
    price: 8.00,
    imageUrl: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?w=200&auto=format&fit=crop&q=60',
    category: 'Sides'
  },
  {
    id: 'm8',
    name: 'Coke Zero',
    description: 'Chilled 330ml can of sugar-free Coca Cola.',
    price: 3.00,
    imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=200&auto=format&fit=crop&q=60',
    category: 'Beverages'
  },
  {
    id: 'm9',
    name: 'Pepperoni Pizza',
    description: 'Fresh mozzarella, tomato sauce, and spicy pepperoni slices.',
    price: 14.50,
    imageUrl: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=200&auto=format&fit=crop&q=60',
    category: 'Main Courses'
  },
  {
    id: 'm10',
    name: 'Caesar Salad',
    description: 'Romaine lettuce, shaved parmesan, garlic croutons, Caesar dressing.',
    price: 9.50,
    imageUrl: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=200&auto=format&fit=crop&q=60',
    category: 'Main Courses'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: '1042',
    customerName: 'Alex Johnson',
    items: [
      { name: 'Classic Burger', quantity: 3, price: 8.50, customizations: 'No Onions' },
      { name: 'Vanilla Milkshake', quantity: 1, price: 4.50 },
      { name: 'Spicy Chicken Wings', quantity: 1, price: 12.00, customizations: 'Extra Ranch' },
      { name: 'Truffle Fries', quantity: 1, price: 8.00 },
      { name: 'Coke Zero', quantity: 1, price: 3.00 }
    ],
    subtotal: 45.00,
    tax: 3.60,
    total: 48.60, // Matches total amount in figma mockup
    status: 'overdue',
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(), // 12 mins ago
    timer: '05:20 Overdue'
  },
  {
    id: '1043',
    customerName: 'Maria Garcia',
    items: [
      { name: 'Spicy Chicken Wings', quantity: 1, price: 12.00 }
    ],
    subtotal: 12.00,
    tax: 0.96,
    total: 12.96,
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 2.2).toISOString(), // 2.2 mins ago
    timer: '02:15'
  },
  {
    id: '1044',
    customerName: 'David Chen',
    items: [
      { name: 'Pepperoni Pizza', quantity: 1, price: 14.50 },
      { name: 'Truffle Fries', quantity: 2, price: 8.00 },
      { name: 'Caesar Salad', quantity: 1, price: 9.50 },
      { name: 'Iced Latte', quantity: 2, price: 4.00 }
    ],
    subtotal: 58.50,
    tax: 4.68,
    total: 63.18,
    status: 'ready',
    createdAt: new Date(Date.now() - 1000 * 60 * 22).toISOString(), // 22 mins ago
    timer: 'Ready'
  },
  {
    id: '1045',
    customerName: 'Sarah Wilson',
    items: [
      { name: 'Classic Burger', quantity: 1, price: 8.50 },
      { name: 'Crispy Fries', quantity: 1, price: 3.00 },
      { name: 'Coke Zero', quantity: 1, price: 3.00 }
    ],
    subtotal: 14.50,
    tax: 1.16,
    total: 15.66,
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    timer: '05:00'
  },
  {
    id: '1046',
    customerName: 'Emma Davis',
    items: [
      { name: 'Chicken', quantity: 2, price: 2.50, customizations: 'No onions' },
      { name: 'Vanilla Milkshake', quantity: 2, price: 4.50 }
    ],
    subtotal: 14.00,
    tax: 1.12,
    total: 15.12,
    status: 'completed',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    paymentMethod: 'card'
  },
  {
    id: '1047',
    customerName: 'James Miller',
    items: [
      { name: 'Pepperoni Pizza', quantity: 2, price: 14.50 },
      { name: 'Coke Zero', quantity: 4, price: 3.00 }
    ],
    subtotal: 41.00,
    tax: 3.28,
    total: 44.28,
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    timer: '08:00'
  },
  {
    id: '1048',
    customerName: 'Linda Wilson',
    items: [
      { name: 'Caesar Salad', quantity: 1, price: 9.50 },
      { name: 'Iced Latte', quantity: 1, price: 4.00 }
    ],
    subtotal: 13.50,
    tax: 1.08,
    total: 14.58,
    status: 'completed',
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    paymentMethod: 'cash'
  },
  {
    id: '1049',
    customerName: 'Robert Taylor',
    items: [
      { name: 'Classic Burger', quantity: 4, price: 8.50, customizations: 'Extra Cheese' },
      { name: 'Crispy Fries', quantity: 4, price: 3.00 }
    ],
    subtotal: 46.00,
    tax: 3.68,
    total: 49.68,
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 11).toISOString(),
    timer: '11:00'
  },
  {
    id: '1050',
    customerName: 'William Thomas',
    items: [
      { name: 'Chicken', quantity: 1, price: 2.50 },
      { name: 'Crispy Fries', quantity: 1, price: 3.00 },
      { name: 'Vanilla Milkshake', quantity: 1, price: 4.50 }
    ],
    subtotal: 10.00,
    tax: 0.80,
    total: 10.80,
    status: 'ready',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    timer: 'Ready'
  },
  {
    id: '1051',
    customerName: 'Sophia White',
    items: [
      { name: 'Pepperoni Pizza', quantity: 1, price: 14.50 },
      { name: 'Vanilla Milkshake', quantity: 3, price: 4.50 }
    ],
    subtotal: 28.00,
    tax: 2.24,
    total: 30.24,
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 1).toISOString(),
    timer: '01:00'
  }
];
