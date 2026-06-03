import React, { useEffect } from 'react';
import { useOrderStore } from '../store/orderStore';
import { Header } from '../components/Header';
import { Clock, CreditCard, DollarSign } from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const { orders, fetchOrders } = useOrderStore();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Filter completed and declined/archived orders
  const pastOrders = orders.filter(o => o.status === 'completed');


  return (
    <div className="flex-1 flex flex-col min-w-0 h-screen select-none bg-space-bg text-left">
      <Header title="Order History Logs" />

      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex justify-between items-center pb-2 border-b border-space-border">
            <h3 className="text-base font-extrabold text-gray-900 font-heading">
              Platform Transaction Log
            </h3>
            <span className="text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-100 px-3 py-1 rounded-full font-extrabold uppercase select-none tracking-wider">
              {pastOrders.length} Completed
            </span>
          </div>

          <div className="bg-white border border-space-border rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-space-border text-space-muted select-none text-[9px] uppercase tracking-wider font-extrabold">
                    <th className="py-4 px-6 text-left w-[15%]">Order ID</th>
                    <th className="py-4 px-6 text-left w-[25%]">Timestamp</th>
                    <th className="py-4 px-6 text-left w-[30%]">Customer</th>
                    <th className="py-4 px-6 text-left w-[15%]">Payment</th>
                    <th className="py-4 px-6 text-right w-[15%]">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-space-border/60">
                  {pastOrders.length > 0 ? (
                    pastOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-4.5 px-6 font-extrabold text-primary select-all">
                          #{order.id}
                        </td>
                        <td className="py-4.5 px-6 text-gray-700 font-semibold flex items-center gap-1.5 mt-1 border-none">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          {new Date(order.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                        </td>
                        <td className="py-4.5 px-6 text-gray-900 font-bold">
                          {order.customerName}
                        </td>
                        <td className="py-4.5 px-6 font-extrabold text-gray-700">
                          <span className="inline-flex items-center gap-1">
                            {order.paymentMethod === 'card' ? (
                              <>
                                <CreditCard className="w-3.5 h-3.5 text-gray-400" />
                                Card
                              </>
                            ) : (
                              <>
                                <DollarSign className="w-3.5 h-3.5 text-gray-400" />
                                Cash
                              </>
                            )}
                          </span>
                        </td>
                        <td className="py-4.5 px-6 text-right font-extrabold text-gray-950 text-sm">
                          ${order.total.toFixed(2)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-space-muted font-semibold">
                        No transactions registered yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default HistoryPage;
