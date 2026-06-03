import { create } from 'zustand';
import type { MenuItem, CartItem, Order, OrderStatus } from '../types/order';
import { apiFetch } from '../utils/api';
import { io, Socket } from 'socket.io-client';

interface OrderStore {
  // Menu/POS State
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  cart: CartItem[];
  cartId: string | null;
  menuItems: MenuItem[];
  categories: string[];
  fetchMenuAndCategories: () => Promise<void>;
  
  // Cart operations
  addToCart: (item: MenuItem, customizations?: string) => Promise<void>;
  updateCartQty: (menuItemId: string, change: number) => Promise<void>;
  clearCart: () => Promise<void>;
  placeOrder: (customerName?: string) => Promise<void>;

  // KDS/Active Orders State
  orders: Order[];
  selectedOrderId: string | null;
  setSelectedOrderId: (id: string | null) => void;
  fetchOrders: () => Promise<void>;
  acceptOrder: (id: string) => Promise<void>;
  declineOrder: (id: string) => Promise<void>;
  completeOrder: (id: string, paymentMethod: 'cash' | 'card') => Promise<void>;

  // Socket.io
  socket: Socket | null;
  initializeSocket: (restaurantId: string) => void;
}

// Helper: Map backend Order model to frontend Order interface
const mapBackendOrder = (o: any): Order => {
  const subtotal = Number(o.totalAmount) / 1.08;
  const tax = Number(o.totalAmount) - subtotal;
  
  // Calculate status and timer dynamically
  const elapsedMs = Date.now() - new Date(o.createdAt).getTime();
  let status: OrderStatus = 'pending';
  if (o.orderStatus === 'COMPLETED') {
    status = 'completed';
  } else if (o.orderStatus === 'ACCEPTED' || o.orderStatus === 'PREPARED') {
    status = 'ready';
  } else if (o.orderStatus === 'DECLINED') {
    status = 'completed'; // Treat declined as archived/history
  } else if (elapsedMs > 10 * 60 * 1000) {
    status = 'overdue';
  }

  let timer: string | undefined = undefined;
  if (o.orderStatus !== 'COMPLETED' && o.orderStatus !== 'DECLINED') {
    if (o.orderStatus === 'ACCEPTED' || o.orderStatus === 'PREPARED') {
      timer = 'Ready';
    } else {
      const elapsedSeconds = Math.floor(elapsedMs / 1000);
      const mins = Math.floor(elapsedSeconds / 60);
      const secs = elapsedSeconds % 60;
      const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      timer = elapsedSeconds > 10 * 60 ? `${timeStr} Overdue` : timeStr;
    }
  }

  return {
    id: o.id,
    customerName: o.customerName,
    items: o.items.map((i: any) => ({
      name: i.menuItem?.name || 'Unknown Item',
      quantity: i.quantity,
      price: Number(i.price),
      customizations: i.customizations || undefined,
    })),
    subtotal,
    tax,
    total: Number(o.totalAmount),
    status,
    createdAt: o.createdAt,
    timer,
  };
};

// Helper: Map backend MenuItem model to frontend MenuItem interface
const mapBackendMenuItem = (item: any): MenuItem => ({
  id: item.id,
  name: item.name,
  description: item.description || '',
  price: Number(item.price),
  imageUrl: item.imageUrl || undefined,
  category: item.category?.name || 'Main Courses',
});

// Helper: Map backend Cart model to frontend CartItem[] interface
const mapBackendCartItems = (backendCart: any): CartItem[] => {
  if (!backendCart || !backendCart.items) return [];
  return backendCart.items.map((item: any) => ({
    id: item.id, // backend CartItem.id
    quantity: item.quantity,
    customizations: item.customizations || undefined,
    menuItem: mapBackendMenuItem(item.menuItem),
  }));
};

export const useOrderStore = create<OrderStore>((set, get) => {
  // Read initial cart session from localStorage
  const savedCartId = localStorage.getItem('pos_cart_id');

  return {
    // Menu/POS default state
    activeCategory: 'All',
    setActiveCategory: (category) => set({ activeCategory: category }),
    searchQuery: '',
    setSearchQuery: (query) => set({ searchQuery: query }),
    cart: [],
    cartId: savedCartId,
    menuItems: [],
    categories: [],

    fetchMenuAndCategories: async () => {
      try {
        const [itemsData, categoriesData] = await Promise.all([
          apiFetch('/restaurant/menu/items'),
          apiFetch('/restaurant/menu/categories'),
        ]);

        const menuItems = itemsData.map(mapBackendMenuItem);
        const categories = categoriesData.map((c: any) => c.name);

        set({ menuItems, categories });
      } catch (error) {
        console.error('❌ Failed to fetch menu catalog:', error);
      }
    },

    // Cart operations
    addToCart: async (item, customizations) => {
      try {
        const { cartId } = get();
        const payload = {
          cartId: cartId || undefined,
          menuItemId: item.id,
          quantity: 1,
          customizations: customizations || undefined,
        };

        const updatedCart = await apiFetch('/restaurant/cart', {
          method: 'POST',
          body: JSON.stringify(payload),
        });

        if (updatedCart) {
          localStorage.setItem('pos_cart_id', updatedCart.id);
          set({
            cartId: updatedCart.id,
            cart: mapBackendCartItems(updatedCart),
          });
        }
      } catch (error) {
        console.error('❌ Failed to add item to cart:', error);
      }
    },

    updateCartQty: async (menuItemId, change) => {
      try {
        const { cartId, cart } = get();
        if (!cartId) return;

        // Find the cart item matching this menuItem.id
        const item = cart.find((c) => c.menuItem.id === menuItemId);
        if (!item || !item.id) return;

        const newQty = item.quantity + change;

        if (newQty <= 0) {
          // Remove from cart
          const updatedCart = await apiFetch(`/restaurant/cart/${cartId}/items/${item.id}`, {
            method: 'DELETE',
          });
          set({ cart: mapBackendCartItems(updatedCart) });
        } else {
          // Update quantity
          const updatedCart = await apiFetch(`/restaurant/cart/${cartId}/items/${item.id}`, {
            method: 'PATCH',
            body: JSON.stringify({ quantity: newQty }),
          });
          set({ cart: mapBackendCartItems(updatedCart) });
        }
      } catch (error) {
        console.error('❌ Failed to update cart item quantity:', error);
      }
    },

    clearCart: async () => {
      try {
        const { cartId } = get();
        if (!cartId) return;

        await apiFetch(`/restaurant/cart/${cartId}`, {
          method: 'DELETE',
        });

        localStorage.removeItem('pos_cart_id');
        set({ cartId: null, cart: [] });
      } catch (error) {
        console.error('❌ Failed to clear cart:', error);
      }
    },

    placeOrder: async (customerName = 'Walk-in Customer') => {
      try {
        const { cartId } = get();
        if (!cartId) return;

        await apiFetch('/restaurant/orders', {
          method: 'POST',
          body: JSON.stringify({
            customerName,
            cartId,
          }),
        });

        // Backend automatically deletes the cart upon order placement
        localStorage.removeItem('pos_cart_id');
        set({ cartId: null, cart: [] });
      } catch (error) {
        console.error('❌ Failed to place order:', error);
      }
    },

    // KDS Default State
    orders: [],
    selectedOrderId: null,
    socket: null,

    fetchOrders: async () => {
      try {
        const ordersData = await apiFetch('/restaurant/orders?limit=100');
        const orders = ordersData.map(mapBackendOrder);
        
        set((state) => {
          const activeOrders = orders.filter((o: Order) => o.status !== 'completed');
          const selectedId = state.selectedOrderId || (activeOrders.length > 0 ? activeOrders[0].id : null);
          return {
            orders,
            selectedOrderId: selectedId,
          };
        });
      } catch (error) {
        console.error('❌ Failed to fetch orders:', error);
      }
    },

    setSelectedOrderId: (id) => set({ selectedOrderId: id }),

    acceptOrder: async (id) => {
      try {
        await apiFetch(`/restaurant/orders/${id}`, {
          method: 'PATCH',
          body: JSON.stringify({ orderStatus: 'ACCEPTED' }),
        });
        // WebSocket event 'update-order' will trigger and update the state automatically
      } catch (error) {
        console.error('❌ Failed to accept order:', error);
      }
    },

    declineOrder: async (id) => {
      try {
        await apiFetch(`/restaurant/orders/${id}`, {
          method: 'PATCH',
          body: JSON.stringify({ orderStatus: 'DECLINED' }),
        });
        // WebSocket event 'update-order' will trigger and update the state automatically
      } catch (error) {
        console.error('❌ Failed to decline order:', error);
      }
    },

    completeOrder: async (id, paymentMethod) => {
      try {
        await apiFetch(`/restaurant/orders/${id}`, {
          method: 'PATCH',
          body: JSON.stringify({
            orderStatus: 'COMPLETED',
            paymentStatus: 'PAID',
          }),
        });
        
        // Store locally what payment method was used for history logs
        set((state) => {
          const updatedOrders = state.orders.map((o) => {
            if (o.id === id) {
              return { ...o, paymentMethod };
            }
            return o;
          });
          return { orders: updatedOrders };
        });
      } catch (error) {
        console.error('❌ Failed to complete order:', error);
      }
    },

    // Socket.io Real-Time connection
    initializeSocket: (restaurantId) => {
      const existingSocket = get().socket;
      if (existingSocket) return;

      const socket = io('http://localhost:5003');
      
      socket.on('connect', () => {
        console.log('⚡ Connected to Socket.io. Joining restaurant:', restaurantId);
        socket.emit('join-restaurant', restaurantId);
      });

      socket.on('new-order', (newOrder: any) => {
        console.log('📡 Socket event "new-order":', newOrder);
        const mapped = mapBackendOrder(newOrder);
        set((state) => {
          if (state.orders.some((o) => o.id === mapped.id)) return {};
          return {
            orders: [mapped, ...state.orders],
            selectedOrderId: state.selectedOrderId || mapped.id,
          };
        });
      });

      socket.on('update-order', (updatedOrder: any) => {
        console.log('📡 Socket event "update-order":', updatedOrder);
        const mapped = mapBackendOrder(updatedOrder);
        set((state) => {
          const updatedOrders = state.orders.map((o) => {
            if (o.id === mapped.id) {
              // Retain local paymentMethod state if exists
              return { ...mapped, paymentMethod: o.paymentMethod || mapped.paymentMethod };
            }
            return o;
          });
          
          // If the selected order is completed or declined, change active selection
          let selectedId = state.selectedOrderId;
          if (selectedId === mapped.id && mapped.status === 'completed') {
            const activeOrders = updatedOrders.filter((o) => o.status !== 'completed');
            selectedId = activeOrders.length > 0 ? activeOrders[0].id : null;
          }

          return {
            orders: updatedOrders,
            selectedOrderId: selectedId,
          };
        });
      });

      set({ socket });
    },
  };
});
export default useOrderStore;
