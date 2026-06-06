import React, { useState } from 'react';
import { useOrderStore } from '../store/orderStore';
import { useAuthStore } from '../store/authStore';
import { Header } from '../components/Header';
import type { OrderStatus } from '../types/order';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, CreditCard, DollarSign, Clock, CheckCircle } from 'lucide-react';

export const OrdersPage: React.FC = () => {
  const { 
    orders, 
    selectedOrderId, 
    setSelectedOrderId, 
    acceptOrder, 
    declineOrder, 
    completeOrder,
    fetchOrders,
    initializeSocket
  } = useOrderStore();

  const restaurant = useAuthStore((state) => state.restaurant);

  React.useEffect(() => {
    fetchOrders();
    if (restaurant?.id) {
      initializeSocket(restaurant.id);
    }
  }, [fetchOrders, initializeSocket, restaurant]);

  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('card');
  const [successOrderId, setSuccessOrderId] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Filter out completed orders for the KDS grid (keep pending, ready, overdue)
  const activeOrders = orders.filter(o => o.status !== 'completed');

  
  // Find selected order
  const selectedOrder = activeOrders.find(o => o.id === selectedOrderId) || activeOrders[0] || null;

  // Sync selected order ID if null
  React.useEffect(() => {
    if (activeOrders.length > 0 && !selectedOrderId) {
      setSelectedOrderId(activeOrders[0].id);
    }
  }, [activeOrders, selectedOrderId, setSelectedOrderId]);

  const handleCompletePayment = (id: string) => {
    // Show success check state first
    setSuccessOrderId(id);
    setTimeout(() => {
      completeOrder(id, paymentMethod);
      setSuccessOrderId(null);
      setIsDetailsOpen(false);
    }, 1200);
  };

  const getStatusBadgeStyle = (status: OrderStatus) => {
    switch (status) {
      case 'overdue':
        return 'bg-red-100 text-red-600 border border-red-200';
      case 'ready':
        return 'bg-green-100 text-green-600 border border-green-200';
      case 'pending':
      default:
        return 'bg-amber-100 text-amber-600 border border-amber-200';
    }
  };

  const getTimerBadgeStyle = (status: OrderStatus) => {
    switch (status) {
      case 'overdue':
        return 'bg-red-500 text-white';
      case 'ready':
        return 'bg-green-500 text-white';
      case 'pending':
      default:
        return 'bg-blue-100 text-blue-600';
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 h-screen select-none bg-space-bg">
      <Header title="Active Orders" />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Left Section: Active Orders Grid */}
        <div className="flex-1 p-4 lg:p-6 overflow-y-auto pb-24 lg:pb-6">
          {activeOrders.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
              <AnimatePresence mode="popLayout">
                {activeOrders.map((order) => {
                  const isSelected = selectedOrderId === order.id;
                  return (
                    <motion.div
                      key={order.id}
                      layoutId={`order-card-${order.id}`}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      whileHover={{ scale: 1.015, boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)' }}
                      onClick={() => {
                        setSelectedOrderId(order.id);
                        setIsDetailsOpen(true);
                      }}
                      className={`p-5 bg-white border rounded-2xl cursor-pointer transition-all duration-200 flex flex-col justify-between min-h-[140px] text-left relative ${
                        isSelected 
                          ? 'border-primary shadow-lg ring-1 ring-primary/40' 
                          : 'border-space-border hover:border-gray-400'
                      }`}
                    >
                      {/* Top Row: Order # and Timer */}
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-extrabold text-gray-900 font-heading">
                          Order #{order.id}
                        </span>
                        
                        {order.timer && (
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1 ${getTimerBadgeStyle(order.status)}`}>
                            {order.status === 'overdue' && <Clock className="w-3 h-3" />}
                            {order.timer}
                          </span>
                        )}
                      </div>

                      {/* Customer Info */}
                      <div className="mt-4">
                        <h4 className="text-base font-extrabold text-gray-900 truncate">
                          {order.customerName}
                        </h4>
                        <p className="text-xs text-space-muted font-semibold mt-1">
                          {order.items.reduce((acc, curr) => acc + curr.quantity, 0)} Items
                        </p>
                      </div>

                      {/* Bottom row: Total and Status badge */}
                      <div className="flex justify-between items-end mt-4">
                        <span className="text-lg font-extrabold text-primary font-heading">
                          ${order.total.toFixed(2)}
                        </span>

                        <span className={`px-3 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wide select-none ${getStatusBadgeStyle(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-space-muted p-8">
              <CheckCircle className="w-12 h-12 text-green-400 mb-4 animate-bounce" />
              <h3 className="font-extrabold text-gray-950">All Orders Completed</h3>
              <p className="text-xs mt-1 font-semibold">Kitchen display queue is empty.</p>
            </div>
          )}
        </div>

        {/* Mobile Details Backdrop */}
        {isDetailsOpen && selectedOrder && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setIsDetailsOpen(false)}
          />
        )}

        {/* Right Section: Order Details Panel */}
        <div className={`fixed lg:relative inset-y-0 right-0 w-[380px] bg-white border-l border-space-border flex flex-col justify-between shrink-0 h-full z-40 shadow-2xl transition-transform duration-300 lg:translate-x-0 lg:shadow-none lg:flex ${isDetailsOpen && selectedOrder ? 'translate-x-0' : 'translate-x-full lg:flex'}`}>
          {selectedOrder ? (
            <div className="flex flex-col h-full justify-between">
              
              {/* Order Info & Items */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Header info & Accept/Decline */}
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="text-left">
                      <h3 className="text-xl font-extrabold font-heading text-gray-950 tracking-tight">
                        Order #{selectedOrder.id}
                      </h3>
                      <p className="text-xs font-semibold text-space-muted mt-1 select-all">
                        Customer: {selectedOrder.customerName}
                      </p>
                    </div>
                    {/* Mobile Close Button */}
                    <button
                      onClick={() => setIsDetailsOpen(false)}
                      className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="border-b border-space-border pb-2"></div>
                </div>

                {/* Items List */}
                <div className="space-y-3.5">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="space-y-3">
                      <div className="flex justify-between items-start text-xs text-left">
                        <div>
                          <p className="font-extrabold text-gray-950 text-[13px]">
                            {item.quantity}x {item.name}
                          </p>
                          {item.customizations && (
                            <p className="text-[10px] text-red-500 font-semibold mt-0.5">
                              {item.customizations}
                            </p>
                          )}
                        </div>
                        <span className="font-extrabold text-gray-800 text-[13px]">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                      <div className="border-b border-space-border/50"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total & Checkout Section */}
              <div className="p-6 border-t border-space-border bg-gray-50/50 space-y-5">
                {/* Total amount */}
                <div className="flex justify-between items-baseline text-left">
                  <span className="text-sm font-extrabold text-space-muted tracking-wide">Total</span>
                  <span className="text-3xl font-extrabold text-gray-950 font-heading">
                    ${selectedOrder.total.toFixed(2)}
                  </span>
                </div>

                {/* Payment selectors */}
                {selectedOrder.status === 'ready' && (
                  <div className="space-y-3.5">
                    <div className="grid grid-cols-2 gap-3.5">
                      <button
                        onClick={() => setPaymentMethod('cash')}
                        className={`py-3.5 rounded-xl border font-extrabold text-xs flex items-center justify-center gap-2 transition-all ${
                          paymentMethod === 'cash'
                            ? 'bg-primary/5 border-primary text-primary shadow-[0_0_12px_rgba(13,82,214,0.05)]'
                            : 'bg-white border-space-border text-gray-600 hover:border-gray-400'
                        }`}
                      >
                        <DollarSign className="w-4 h-4" />
                        Cash
                      </button>
                      <button
                        onClick={() => setPaymentMethod('card')}
                        className={`py-3.5 rounded-xl border font-extrabold text-xs flex items-center justify-center gap-2 transition-all ${
                          paymentMethod === 'card'
                            ? 'bg-primary/5 border-primary text-primary shadow-[0_0_12px_rgba(13,82,214,0.05)]'
                            : 'bg-white border-space-border text-gray-600 hover:border-gray-400'
                        }`}
                      >
                        <CreditCard className="w-4 h-4" />
                        Card
                      </button>
                    </div>

                    {/* Action checkout button */}
                    <button
                      disabled={successOrderId === selectedOrder.id}
                      onClick={() => handleCompletePayment(selectedOrder.id)}
                      className={`w-full py-4 text-white rounded-xl text-xs font-extrabold tracking-wider transition-all duration-300 flex items-center justify-center gap-2 uppercase ${
                        successOrderId === selectedOrder.id
                          ? 'bg-green-600 shadow-md shadow-green-600/10'
                          : 'bg-primary hover:bg-primary-dark shadow-lg shadow-primary/10'
                      }`}
                    >
                      {successOrderId === selectedOrder.id ? (
                        <>
                          <Check className="w-4 h-4 animate-ping" />
                          Order Completed
                        </>
                      ) : (
                        'Make Payment'
                      )}
                    </button>
                  </div>
                )}

                {/* Action buttons if pending */}
                {selectedOrder.status !== 'ready' && (
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-bold rounded-lg text-center uppercase tracking-wider">
                      🔒 Accept Order to Enable Payment processing
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => {
                          declineOrder(selectedOrder.id);
                          setIsDetailsOpen(false);
                        }}
                        className="py-3.5 rounded-xl border border-red-200 hover:border-red-500 hover:bg-red-50 text-red-500 font-extrabold text-xs flex items-center justify-center gap-2 transition-all bg-white"
                      >
                        <X className="w-4 h-4" />
                        Decline
                      </button>
                      <button
                        onClick={() => acceptOrder(selectedOrder.id)}
                        className="py-3.5 bg-green-600 hover:bg-green-500 text-white rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-green-600/10"
                      >
                        <Check className="w-4 h-4" />
                        Accept Order
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-space-muted p-8 font-semibold text-xs text-center">
              Select an active order from the grid to view details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default OrdersPage;
