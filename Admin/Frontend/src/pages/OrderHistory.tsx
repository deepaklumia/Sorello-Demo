import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { 
  Search, 
  Calendar, 
  FileSpreadsheet, 
  ChevronLeft, 
  ChevronRight, 
  Receipt,
  AlertCircle,
  X,
  CreditCard,
  History
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Order {
  id: string;
  customerName: string;
  totalAmount: string;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
}

interface PaginationMeta {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export const OrderHistory: React.FC = () => {
  const { restaurant } = useAuth();
  
  // State
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    limit: 8,
    totalCount: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Order Drawer
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async (targetPage = 1) => {
    try {
      setLoading(true);
      setError(null);

      // Build query string
      const params = new URLSearchParams();
      params.append('page', targetPage.toString());
      params.append('limit', pagination.limit.toString());

      if (statusFilter) params.append('orderStatus', statusFilter);
      if (paymentFilter) params.append('paymentStatus', paymentFilter);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const res = await api.get(`/restaurant/orders?${params.toString()}`);
      
      if (res && res.data) {
        setOrders(res.data);
        if (res.meta) {
          setPagination(res.meta);
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to fetch order history records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(1);
  }, [statusFilter, paymentFilter, startDate, endDate]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders(1);
  };

  // Status badge styling helpers
  const getOrderStatusPillClass = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return 'bg-amber-500/10 border border-amber-500/20 text-amber-400';
      case 'ACCEPTED':
      case 'PREPARED':
        return 'bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan';
      case 'COMPLETED':
        return 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400';
      case 'DECLINED':
        return 'bg-rose-500/10 border border-rose-500/20 text-rose-400';
      default:
        return 'bg-space-border/20 text-space-muted';
    }
  };

  const getPaymentStatusPillClass = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return 'bg-amber-500/10 border border-amber-500/20 text-amber-400';
      case 'PAID':
        return 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400';
      case 'FAILED':
        return 'bg-rose-500/10 border border-rose-500/20 text-rose-400';
      case 'REFUNDED':
        return 'bg-accent-purple/10 border border-accent-purple/20 text-accent-purple';
      default:
        return 'bg-space-border/20 text-space-muted';
    }
  };

  // Generate high-fidelity receipt items based on restaurant slug and total amount
  const getReceiptDetails = (order: Order) => {
    const total = Number(order.totalAmount);
    const subtotal = total / 1.08;
    const tax = total - subtotal;

    // Pick item names based on restaurant type
    const slug = restaurant?.slug || 'burger-palace';
    let dish1 = 'Chef Special Roll';
    let dish2 = 'Imperial Saké Pour';
    
    if (slug === 'burger-palace') {
      dish1 = 'Wagyu Beef Slider Combo';
      dish2 = 'Double Truffle Fries';
    } else if (slug === 'sushi-zen') {
      dish1 = 'Dragon Eel Special Roll';
      dish2 = 'Premium Hot Matcha';
    } else {
      dish1 = 'Pepperoni Supreme Pizza';
      dish2 = 'Garlic Bread with Cheese';
    }

    const price1 = subtotal * 0.7;
    const price2 = subtotal * 0.3;

    return {
      items: [
        { name: dish1, qty: 1, price: price1 },
        { name: dish2, qty: 1, price: price2 }
      ],
      subtotal,
      tax,
      total
    };
  };

  const handleExportCSV = () => {
    const headers = 'Order ID,Customer,Date,Total Amount,Order Status,Payment Status\n';
    const rows = orders.map(o => {
      return `"${o.id}","${o.customerName}","${new Date(o.createdAt).toLocaleString()}",$${o.totalAmount},${o.orderStatus},${o.paymentStatus}`;
    }).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `order_history_${new Date().toISOString().slice(0,10)}.csv`);
    a.click();
  };

  // Simulated Refund Action
  const handleRefundAction = async (orderId: string) => {
    if (window.confirm(`Issue complete refund for Order #${orderId.slice(0, 8).toUpperCase()}?`)) {
      alert('Refund processed successfully via Stripe Sandbox.');
      setSelectedOrder(prev => prev ? { ...prev, paymentStatus: 'REFUNDED' } : null);
      setOrders(orders.map(o => o.id === orderId ? { ...o, paymentStatus: 'REFUNDED' } : o));
    }
  };

  // Filter orders by local search query if needed (in case api doesn't support search yet)
  const displayedOrders = searchQuery.trim() === '' 
    ? orders 
    : orders.filter(o => 
        o.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
        o.customerName.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <div className="space-y-6 text-left relative min-h-screen pb-16">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold font-heading text-white tracking-tight">
            Order Logs
          </h2>
          <p className="text-xs text-space-muted mt-1 font-medium">
            Search, filter, and audit past customer transactions and checkout timelines.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="bg-[#151B2C] hover:bg-[#1E273E] text-white border border-space-border/80 font-bold px-4 py-2.5 rounded-lg text-xs tracking-wider flex items-center gap-2 transition-all w-full sm:w-auto justify-center"
        >
          <FileSpreadsheet className="w-4 h-4 text-space-muted" />
          Export CSV
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs font-semibold leading-relaxed flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filters Tray */}
      <div className="glass-card rounded-xl p-5 border border-space-border/60">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          {/* Local Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-space-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search ID or Customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0B0F19] border border-space-border rounded-lg py-2 pl-9 pr-3 text-xs text-white placeholder-space-muted/50 focus:border-accent-cyan focus:outline-none"
            />
          </div>

          {/* Date range start */}
          <div className="relative">
            <Calendar className="w-4 h-4 text-space-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-[#0B0F19] border border-space-border rounded-lg py-2 pl-9 pr-3 text-xs text-white focus:border-accent-cyan focus:outline-none cursor-pointer"
            />
          </div>

          {/* Date range end */}
          <div className="relative">
            <Calendar className="w-4 h-4 text-space-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-[#0B0F19] border border-space-border rounded-lg py-2 pl-9 pr-3 text-xs text-white focus:border-accent-cyan focus:outline-none cursor-pointer"
            />
          </div>

          {/* Order Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-[#0B0F19] border border-space-border rounded-lg py-2 px-3 text-xs text-white focus:border-accent-cyan focus:outline-none cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="PREPARED">Prepared</option>
            <option value="COMPLETED">Completed</option>
            <option value="DECLINED">Declined</option>
          </select>

          {/* Payment Status */}
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="w-full bg-[#0B0F19] border border-space-border rounded-lg py-2 px-3 text-xs text-white focus:border-accent-cyan focus:outline-none cursor-pointer"
          >
            <option value="">All Payments</option>
            <option value="PENDING">Pending</option>
            <option value="PAID">Paid</option>
            <option value="FAILED">Failed</option>
            <option value="REFUNDED">Refunded</option>
          </select>
        </form>
      </div>

      {/* Orders Table Layout */}
      <div className="glass-card rounded-xl border border-space-border/60 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-space-surface/30 border-b border-space-border/40 text-space-muted select-none text-[9px] uppercase tracking-wider">
                <th className="py-4 px-6 text-left font-extrabold">Order ID</th>
                <th className="py-4 px-6 text-left font-extrabold">Timestamp</th>
                <th className="py-4 px-6 text-left font-extrabold">Customer</th>
                <th className="py-4 px-6 text-left font-extrabold">Total</th>
                <th className="py-4 px-6 text-left font-extrabold">Order Status</th>
                <th className="py-4 px-6 text-left font-extrabold">Payment</th>
                <th className="py-4 px-6 text-center font-extrabold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-space-border/20">
              {displayedOrders.length > 0 ? (
                displayedOrders.map((order) => (
                  <tr 
                    key={order.id} 
                    className={`hover:bg-space-surface/10 transition-all duration-150 cursor-pointer ${
                      selectedOrder?.id === order.id ? 'bg-[#151B2C]/40 border-l-[3px] border-l-accent-cyan' : ''
                    }`}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <td className="py-4 px-6 font-extrabold text-accent-cyan select-all">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="py-4 px-6 text-white font-semibold">
                      {new Date(order.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                    </td>
                    <td className="py-4 px-6 text-white font-bold flex items-center gap-2 mt-2.5 border-none">
                      <div className="w-6 h-6 rounded-full bg-space-surface flex items-center justify-center font-extrabold text-[10px] text-space-muted">
                        {order.customerName.slice(0, 2).toUpperCase()}
                      </div>
                      {order.customerName}
                    </td>
                    <td className="py-4 px-6 text-white font-extrabold">
                      ${Number(order.totalAmount).toFixed(2)}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${getOrderStatusPillClass(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${getPaymentStatusPillClass(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-1.5 hover:bg-space-surface rounded text-space-muted hover:text-accent-cyan transition-colors"
                        title="Audit Log details"
                      >
                        <Receipt className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-space-muted font-semibold">
                    {loading ? 'Fetching logs...' : 'No orders found matching filters.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination footer */}
        <div className="p-4 border-t border-space-border/40 bg-[#0E1322]/20 flex justify-between items-center select-none text-[10px] font-bold text-space-muted tracking-wider uppercase">
          <span>
            Showing {displayedOrders.length} of {pagination.totalCount} orders
          </span>

          <div className="flex items-center gap-1">
            <button
              disabled={!pagination.hasPreviousPage || loading}
              onClick={() => fetchOrders(pagination.page - 1)}
              className="p-2 border border-space-border/50 rounded-lg hover:border-white disabled:opacity-30 disabled:hover:border-space-border/50 text-white transition-all"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="px-3 py-1.5 bg-space-surface rounded-lg text-white font-extrabold">
              {pagination.page}
            </span>
            <button
              disabled={!pagination.hasNextPage || loading}
              onClick={() => fetchOrders(pagination.page + 1)}
              className="p-2 border border-space-border/50 rounded-lg hover:border-white disabled:opacity-30 disabled:hover:border-space-border/50 text-white transition-all"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Right Drawer Overlay (Receipt & Timeline Details) */}
      {selectedOrder && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-space-dark/80 backdrop-blur-sm z-30"
            onClick={() => setSelectedOrder(null)}
          ></div>

          {/* Drawer container */}
          <div className="fixed top-0 right-0 bottom-0 w-full sm:w-[420px] bg-[#0C101B] border-l border-space-border/80 shadow-2xl z-40 flex flex-col justify-between text-left animate-slide-left">
            {/* Header */}
            <div className="p-5 border-b border-space-border/30 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-extrabold font-heading text-white tracking-wide">
                  Order #{selectedOrder.id.slice(0, 8).toUpperCase()}
                </h3>
                <p className="text-[10px] text-space-muted font-bold tracking-widest uppercase mt-0.5">
                  Details & Audit Log
                </p>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-space-muted hover:text-white hover:bg-space-surface rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Itemized receipt details */}
              <div className="space-y-4">
                <h4 className="text-[10px] uppercase tracking-wider text-space-muted font-extrabold flex items-center gap-1.5 border-b border-space-border/20 pb-2">
                  <Receipt className="w-3.5 h-3.5 text-accent-cyan" />
                  Itemized Receipt
                </h4>
                
                {/* Generated receipt items */}
                <div className="space-y-2.5">
                  {(() => {
                    const detail = getReceiptDetails(selectedOrder);
                    return (
                      <>
                        {detail.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-xs text-white">
                            <span>
                              {item.qty}x <span className="font-semibold text-space-muted/80">{item.name}</span>
                            </span>
                            <span className="font-extrabold">${item.price.toFixed(2)}</span>
                          </div>
                        ))}

                        <div className="border-t border-space-border/30 pt-3 mt-4 space-y-2 text-[11px] text-space-muted">
                          <div className="flex justify-between font-semibold">
                            <span>Subtotal</span>
                            <span className="text-white">${detail.subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between font-semibold">
                            <span>Tax (8%)</span>
                            <span className="text-white">${detail.tax.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm font-extrabold text-white border-t border-space-border/30 pt-2">
                            <span>TOTAL</span>
                            <span className="text-accent-cyan">${detail.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Payment Details */}
              <div className="space-y-3">
                <h4 className="text-[10px] uppercase tracking-wider text-space-muted font-extrabold flex items-center gap-1.5 border-b border-space-border/20 pb-2">
                  <CreditCard className="w-3.5 h-3.5 text-accent-cyan" />
                  Payment Metadata
                </h4>
                <div className="bg-space-surface/40 p-3.5 rounded-lg border border-space-border/40 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-space-muted font-semibold">Method</span>
                    <span className="text-white font-bold flex items-center gap-1">
                      💳 Visa •••• 4242
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-space-muted font-semibold">TXN ID</span>
                    <span className="text-white font-mono select-all text-[10px]">
                      ch_3N82XjLkdPoas{selectedOrder.id.slice(0, 4)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Audit Timeline logs */}
              <div className="space-y-4">
                <h4 className="text-[10px] uppercase tracking-wider text-space-muted font-extrabold flex items-center gap-1.5 border-b border-space-border/20 pb-2">
                  <History className="w-3.5 h-3.5 text-accent-cyan" />
                  Audit Timeline
                </h4>

                <div className="relative border-l border-space-border/60 pl-6 space-y-5 ml-2.5">
                  {/* Step 1: Confirmed */}
                  <div className="relative">
                    <div className="absolute -left-[31px] top-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#0C101B]"></div>
                    <p className="text-xs font-bold text-white">Payment Confirmed</p>
                    <p className="text-[10px] text-space-muted mt-0.5 font-semibold">
                      System (Stripe Stripeout Gateway)
                    </p>
                  </div>

                  {/* Step 2: Completed */}
                  {selectedOrder.orderStatus === 'COMPLETED' && (
                    <div className="relative">
                      <div className="absolute -left-[31px] top-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#0C101B]"></div>
                      <p className="text-xs font-bold text-white">Order Completed</p>
                      <p className="text-[10px] text-space-muted mt-0.5 font-semibold">
                        Server: {selectedOrder.customerName}
                      </p>
                    </div>
                  )}

                  {/* Step 3: Prepared */}
                  {(selectedOrder.orderStatus === 'COMPLETED' || selectedOrder.orderStatus === 'PREPARED') && (
                    <div className="relative">
                      <div className="absolute -left-[31px] top-0 w-3.5 h-3.5 rounded-full bg-accent-cyan border-2 border-[#0C101B]"></div>
                      <p className="text-xs font-bold text-white">Ready for Pickup</p>
                      <p className="text-[10px] text-space-muted mt-0.5 font-semibold">
                        Kitchen Dispatch Terminal
                      </p>
                    </div>
                  )}

                  {/* Step 4: Received */}
                  <div className="relative">
                    <div className="absolute -left-[31px] top-0 w-3.5 h-3.5 rounded-full bg-space-border border-2 border-[#0C101B]"></div>
                    <p className="text-xs font-bold text-white">Order Received</p>
                    <p className="text-[10px] text-space-muted mt-0.5 font-semibold">
                      POS Dispatch System
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-space-border/40 bg-[#0E1322]/40 grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  alert('Receipt print job sent to terminal queue.');
                }}
                className="w-full py-2.5 border border-space-border hover:border-white text-white hover:text-white rounded-lg text-xs font-bold transition-all text-center"
              >
                Print Receipt
              </button>

              <button
                disabled={selectedOrder.paymentStatus === 'REFUNDED'}
                onClick={() => handleRefundAction(selectedOrder.id)}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 disabled:bg-space-border disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-xs font-bold transition-all text-center"
              >
                {selectedOrder.paymentStatus === 'REFUNDED' ? 'Refunded' : 'Issue Refund'}
              </button>
            </div>
          </div>
        </>
      )}

    </div>
  );
};
export default OrderHistory;
