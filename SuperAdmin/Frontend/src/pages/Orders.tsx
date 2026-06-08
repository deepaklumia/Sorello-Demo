import React, { useEffect, useState } from 'react';
import { api } from '../utils/api';
import { formatCurrency, formatDate, formatRelativeTime } from '../utils/format';
import {
  Filter,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
  ShoppingBag,
  DollarSign,
  User,
  Clock,
  Store,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Activity,
  Archive
} from 'lucide-react';

export const Orders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingRestaurants, setLoadingRestaurants] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [selectedRestaurant, setSelectedRestaurant] = useState<string>('ALL');
  const [selectedOrderStatus, setSelectedOrderStatus] = useState<string>('ALL');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<string>('ALL');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<any>(null);

  // Detail Modal state
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Fetch initial restaurants list for the dropdown filter
  const fetchRestaurants = async () => {
    try {
      setLoadingRestaurants(true);
      const response = await api.get('/admin/restaurants?limit=100');
      setRestaurants(response.data || []);
    } catch (e) {
      console.error('Error loading restaurants for filter dropdown:', e);
    } finally {
      setLoadingRestaurants(false);
    }
  };

  // Fetch orders with current active filters
  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      let queryParams = `?page=${page}&limit=10`;
      if (selectedRestaurant !== 'ALL') {
        queryParams += `&restaurantId=${selectedRestaurant}`;
      }
      if (selectedOrderStatus !== 'ALL') {
        queryParams += `&orderStatus=${selectedOrderStatus}`;
      }
      if (selectedPaymentStatus !== 'ALL') {
        queryParams += `&paymentStatus=${selectedPaymentStatus}`;
      }

      const response = await api.get(`/admin/orders${queryParams}`);
      setOrders(response.data || []);
      setMeta(response.meta);
    } catch (err: any) {
      console.error('Error loading platform orders:', err);
      setError(err.message || 'Failed to fetch platform orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [page, selectedRestaurant, selectedOrderStatus, selectedPaymentStatus]);

  const handleResetFilters = () => {
    setSelectedRestaurant('ALL');
    setSelectedOrderStatus('ALL');
    setSelectedPaymentStatus('ALL');
    setPage(1);
  };

  // Open detailed order info modal
  const handleOpenDetail = async (orderId: string) => {
    setLoadingDetail(true);
    try {
      const response = await api.get(`/admin/orders/${orderId}`);
      setSelectedOrder(response.data);
    } catch (e: any) {
      alert(e.message || 'Failed to retrieve order details.');
    } finally {
      setLoadingDetail(false);
    }
  };

  // Helper styles for badges
  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full text-[10px] font-bold">
            <span className="w-1 h-1 bg-amber-400 rounded-full animate-ping"></span>
            Pending
          </span>
        );
      case 'ACCEPTED':
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 bg-cyan-500/10 border border-cyan-500/20 text-accent-cyan rounded-full text-[10px] font-bold">
            <span className="w-1 h-1 bg-accent-cyan rounded-full"></span>
            Accepted
          </span>
        );
      case 'PREPARED':
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 bg-purple-500/10 border border-purple-500/20 text-purple-300 rounded-full text-[10px] font-bold">
            <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
            Prepared
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-bold">
            <span className="w-1 h-1 bg-emerald-400 rounded-full"></span>
            Completed
          </span>
        );
      case 'DECLINED':
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-full text-[10px] font-bold">
            <span className="w-1 h-1 bg-rose-400 rounded-full"></span>
            Declined
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 bg-space-dark border border-space-border/50 rounded-md font-semibold text-space-muted text-[10px]">
            {status}
          </span>
        );
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded text-[9px] font-extrabold tracking-wider uppercase">
            Paid
          </span>
        );
      case 'PENDING':
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded text-[9px] font-extrabold tracking-wider uppercase">
            Unpaid
          </span>
        );
      case 'FAILED':
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded text-[9px] font-extrabold tracking-wider uppercase">
            Failed
          </span>
        );
      case 'REFUNDED':
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded text-[9px] font-extrabold tracking-wider uppercase">
            Refunded
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 bg-space-dark border border-space-border/50 rounded font-semibold text-space-muted text-[9px] uppercase">
            {status}
          </span>
        );
    }
  };

  // Compile items summary string e.g. "2x Cheese Pizza, 1x Coke"
  const getItemsSummary = (orderItems: any[]) => {
    if (!orderItems || orderItems.length === 0) return 'No items';
    return orderItems
      .map((item) => `${item.quantity}x ${item.menuItem?.name || 'Item'}`)
      .join(', ');
  };

  // Calculate order stats totals from loaded page/list (or simple estimations)
  const totalVolume = orders.reduce((sum, o) => sum + parseFloat(o.totalAmount || 0), 0);
  const pendingOrdersCount = orders.filter((o) => o.orderStatus === 'PENDING').length;
  const completedOrdersCount = orders.filter((o) => o.orderStatus === 'COMPLETED').length;

  return (
    <div className="space-y-8 text-left relative">
      {/* 1. Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-extrabold font-heading text-white tracking-tight">Order Auditing Hub</h2>
          <p className="text-xs text-space-muted mt-1.5 font-medium">Browse, filter, and audit transaction records across all platform nodes.</p>
        </div>
        <button
          onClick={fetchOrders}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 bg-space-surface border border-space-border hover:border-accent-cyan/60 rounded-lg text-xs font-bold text-white transition-all shadow-[0_0_12px_rgba(0,0,0,0.2)] disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-accent-cyan' : 'text-space-muted'}`} />
          Force Sync
        </button>
      </div>

      {/* 2. Simple Statistics Widget grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card rounded-xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-accent-cyan/10 border border-accent-cyan/25 flex items-center justify-center text-accent-cyan shrink-0">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-space-muted uppercase tracking-wider font-bold">Total Page Orders</span>
            <h4 className="text-lg font-extrabold text-white mt-0.5">{orders.length}</h4>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-space-muted uppercase tracking-wider font-bold">Audited Volume</span>
            <h4 className="text-lg font-extrabold text-white mt-0.5">{formatCurrency(totalVolume)}</h4>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 shrink-0">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] text-space-muted uppercase tracking-wider font-bold">Awaiting Action</span>
            <h4 className="text-lg font-extrabold text-white mt-0.5">{pendingOrdersCount} PENDING</h4>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-400 shrink-0">
            <Archive className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-space-muted uppercase tracking-wider font-bold">Completed Batches</span>
            <h4 className="text-lg font-extrabold text-white mt-0.5">{completedOrdersCount} orders</h4>
          </div>
        </div>
      </div>

      {/* 3. Filters Controller Bar */}
      <div className="glass-card rounded-xl p-4 flex flex-wrap gap-4 items-center justify-between shadow-lg">
        <div className="flex flex-wrap items-center gap-3.5">
          <div className="flex items-center gap-2 text-xs text-space-muted font-bold tracking-wide">
            <Filter className="w-4 h-4 text-accent-cyan" />
            Filters:
          </div>

          {/* Restaurant Selector */}
          <div className="flex flex-col">
            <select
              value={selectedRestaurant}
              onChange={(e) => {
                setSelectedRestaurant(e.target.value);
                setPage(1);
              }}
              className="bg-space-dark border border-space-border/80 rounded-lg text-xs font-semibold text-white focus:border-accent-cyan/60 focus:outline-none px-3.5 py-2 cursor-pointer transition-colors max-w-[200px]"
              disabled={loadingRestaurants}
            >
              <option value="ALL">All Restaurants</option>
              {restaurants.map((res) => (
                <option key={res.id} value={res.id}>
                  {res.name}
                </option>
              ))}
            </select>
          </div>

          {/* Order Status Selector */}
          <div>
            <select
              value={selectedOrderStatus}
              onChange={(e) => {
                setSelectedOrderStatus(e.target.value);
                setPage(1);
              }}
              className="bg-space-dark border border-space-border/80 rounded-lg text-xs font-semibold text-white focus:border-accent-cyan/60 focus:outline-none px-3.5 py-2 cursor-pointer transition-colors"
            >
              <option value="ALL">All Order Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="PREPARED">Prepared</option>
              <option value="COMPLETED">Completed</option>
              <option value="DECLINED">Declined</option>
            </select>
          </div>

          {/* Payment Status Selector */}
          <div>
            <select
              value={selectedPaymentStatus}
              onChange={(e) => {
                setSelectedPaymentStatus(e.target.value);
                setPage(1);
              }}
              className="bg-space-dark border border-space-border/80 rounded-lg text-xs font-semibold text-white focus:border-accent-cyan/60 focus:outline-none px-3.5 py-2 cursor-pointer transition-colors"
            >
              <option value="ALL">All Payment Statuses</option>
              <option value="PENDING">Unpaid / Pending</option>
              <option value="PAID">Paid</option>
              <option value="FAILED">Failed</option>
              <option value="REFUNDED">Refunded</option>
            </select>
          </div>
        </div>

        {/* Reset button */}
        {(selectedRestaurant !== 'ALL' || selectedOrderStatus !== 'ALL' || selectedPaymentStatus !== 'ALL') && (
          <button
            onClick={handleResetFilters}
            className="text-xs font-bold text-accent-cyan hover:underline hover:text-white transition-all flex items-center gap-1.5"
          >
            <X className="w-3.5 h-3.5" />
            Clear active filters
          </button>
        )}
      </div>

      {/* 4. Orders Data Table */}
      <div className="glass-card rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-space-border bg-space-surface/30">
                <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-space-muted font-sans">Order ID</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-space-muted font-sans">Restaurant</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-space-muted font-sans">Customer</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-space-muted font-sans">Items Summary</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-space-muted font-sans">Total Amount</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-space-muted font-sans">Order Status</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-space-muted font-sans">Payment</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-space-muted font-sans">Created</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-space-muted font-sans text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-space-border/30 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={9} className="p-16 text-center text-space-muted">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-accent-cyan" />
                    Fetching database records...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={9} className="p-16 text-center text-rose-400 font-bold">
                    <AlertCircle className="w-8 h-8 mx-auto mb-3 text-rose-500" />
                    {error}
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-16 text-center text-space-muted font-medium">
                    No orders registered in the system matching the active queries.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => handleOpenDetail(order.id)}
                    className="hover:bg-space-surface/20 active:bg-space-surface/30 cursor-pointer transition-all duration-200"
                  >
                    {/* ID */}
                    <td className="p-4 font-bold text-white tracking-wide">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </td>
                    {/* Restaurant */}
                    <td className="p-4 text-white font-semibold">
                      <div className="flex items-center gap-2">
                        <Store className="w-3.5 h-3.5 text-accent-purple shrink-0" />
                        {order.restaurant?.name || 'Global Node'}
                      </div>
                    </td>
                    {/* Customer */}
                    <td className="p-4 text-white font-semibold">{order.customerName}</td>
                    {/* Items Summary */}
                    <td className="p-4 text-space-muted font-medium truncate max-w-[200px]" title={getItemsSummary(order.items)}>
                      {getItemsSummary(order.items)}
                    </td>
                    {/* Amount */}
                    <td className="p-4 font-extrabold text-accent-cyan">
                      {formatCurrency(order.totalAmount)}
                    </td>
                    {/* Order Status */}
                    <td className="p-4">{getOrderStatusBadge(order.orderStatus)}</td>
                    {/* Payment Status */}
                    <td className="p-4">{getPaymentStatusBadge(order.paymentStatus)}</td>
                    {/* Created */}
                    <td className="p-4 text-space-muted font-medium">
                      <span className="block">{formatDate(order.createdAt)}</span>
                      <span className="text-[9px] text-space-muted/70">{formatRelativeTime(order.createdAt)}</span>
                    </td>
                    {/* Action */}
                    <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleOpenDetail(order.id)}
                        className="p-1.5 bg-space-dark hover:bg-space-surface border border-space-border hover:border-accent-cyan/60 rounded text-accent-cyan transition-all"
                        title="Audit Log"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 5. Pagination Footer */}
        {meta && meta.totalPages > 1 && (
          <div className="p-4 border-t border-space-border flex justify-between items-center bg-space-surface/10 text-xs">
            <span className="text-space-muted font-medium">
              Showing {(meta.page - 1) * meta.limit + 1} - {Math.min(meta.page * meta.limit, meta.totalCount)} of {meta.totalCount} transaction audits
            </span>
            <div className="flex gap-1.5">
              <button
                disabled={!meta.hasPreviousPage}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 bg-space-dark border border-space-border rounded text-space-muted hover:text-white disabled:opacity-30 transition-all text-[10px] font-bold flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Previous
              </button>
              {Array.from({ length: meta.totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-3 py-1 rounded text-[10px] font-bold border transition-all ${
                    page === i + 1
                      ? 'bg-accent-cyan border-accent-cyan text-space-dark font-extrabold'
                      : 'bg-space-dark border-space-border text-space-muted hover:text-white'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={!meta.hasNextPage}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 bg-space-dark border border-space-border rounded text-space-muted hover:text-white disabled:opacity-30 transition-all text-[10px] font-bold flex items-center gap-1"
              >
                Next
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 6. Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-[#070A13]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card rounded-2xl border border-space-border/85 bg-space-dark shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="h-16 px-6 border-b border-space-border/60 flex items-center justify-between bg-space-surface/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center text-accent-cyan">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-heading text-white tracking-tight">
                    Order Details: #{selectedOrder.id.slice(0, 8).toUpperCase()}
                  </h3>
                  <p className="text-[10px] text-space-muted leading-none mt-0.5">
                    Captured {formatDate(selectedOrder.createdAt)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-space-muted hover:text-white hover:bg-space-surface/60 p-1.5 rounded-lg transition-colors border border-transparent hover:border-space-border"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column: Transaction entities information */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-accent-cyan">
                    System Audit Metadata
                  </h4>

                  <div className="glass-card rounded-lg p-3 bg-space-surface/10 space-y-3.5 text-[11px]">
                    <div className="flex justify-between items-center">
                      <span className="text-space-muted font-semibold flex items-center gap-1.5">
                        <Store className="w-3.5 h-3.5 text-accent-purple" />
                        Restaurant Node
                      </span>
                      <span className="text-white font-bold">{selectedOrder.restaurant?.name || 'Unknown Node'}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-space-muted font-semibold flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-accent-cyan" />
                        Customer Name
                      </span>
                      <span className="text-white font-bold">{selectedOrder.customerName}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-space-muted font-semibold flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-space-muted" />
                        Created Time
                      </span>
                      <span className="text-white font-semibold">
                        {new Date(selectedOrder.createdAt).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-space-muted font-semibold flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-space-muted" />
                        Payment Status
                      </span>
                      <span>{getPaymentStatusBadge(selectedOrder.paymentStatus)}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-space-muted font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-space-muted" />
                        Order Status
                      </span>
                      <span>{getOrderStatusBadge(selectedOrder.orderStatus)}</span>
                    </div>
                  </div>

                  {selectedOrder.restaurant && (
                    <div className="glass-card rounded-lg p-3 bg-space-surface/5 text-[10px] space-y-1.5">
                      <h5 className="font-bold text-white uppercase tracking-wider text-[9px] mb-1">Restaurant Contact</h5>
                      <p className="text-space-muted"><span className="font-bold text-white">Email:</span> {selectedOrder.restaurant.email}</p>
                      <p className="text-space-muted"><span className="font-bold text-white">Phone:</span> {selectedOrder.restaurant.phone}</p>
                      <p className="text-space-muted"><span className="font-bold text-white">Address:</span> {selectedOrder.restaurant.address}</p>
                    </div>
                  )}
                </div>

                {/* Right Column: Ordered Items Invoice details */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-accent-cyan">
                    Ordered Invoice Items
                  </h4>

                  <div className="glass-card rounded-lg overflow-hidden border border-space-border/60">
                    <div className="p-3 bg-space-surface/20 text-[9px] font-extrabold uppercase text-space-muted tracking-wider grid grid-cols-12 gap-2 border-b border-space-border/60">
                      <span className="col-span-6">Item details</span>
                      <span className="col-span-2 text-center">Qty</span>
                      <span className="col-span-4 text-right">Subtotal</span>
                    </div>

                    <div className="divide-y divide-space-border/30 max-h-48 overflow-y-auto">
                      {selectedOrder.items?.map((item: any) => {
                        const itemPrice = parseFloat(item.price || 0);
                        const itemQty = parseInt(item.quantity || 1, 10);
                        return (
                          <div key={item.id} className="p-3 grid grid-cols-12 gap-2 items-center text-[11px]">
                            <div className="col-span-6">
                              <p className="font-bold text-white leading-tight">
                                {item.menuItem?.name || 'Custom item'}
                              </p>
                              {item.customizations && (
                                <span className="text-[9px] text-accent-cyan italic block mt-0.5">
                                  "{item.customizations}"
                                </span>
                              )}
                            </div>
                            <span className="col-span-2 text-center font-bold text-space-muted">
                              x{itemQty}
                            </span>
                            <span className="col-span-4 text-right font-extrabold text-white">
                              {formatCurrency(itemPrice * itemQty)}
                            </span>
                          </div>
                        );
                      })}

                      {(!selectedOrder.items || selectedOrder.items.length === 0) && (
                        <div className="p-4 text-center text-[11px] text-space-muted">
                          No items mapped in invoice.
                        </div>
                      )}
                    </div>

                    <div className="p-3 bg-space-surface/30 border-t border-space-border/60 flex justify-between items-center text-xs">
                      <span className="font-extrabold text-white">Grand total:</span>
                      <span className="text-sm font-black text-accent-cyan">
                        {formatCurrency(selectedOrder.totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="h-16 px-6 border-t border-space-border/60 flex items-center justify-end bg-space-surface/10">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 bg-space-dark border border-space-border hover:border-space-border/80 rounded-lg text-xs font-bold text-white transition-all shadow-[0_0_8px_rgba(0,0,0,0.1)]"
              >
                Close audit logs
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
