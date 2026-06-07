"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Search, Filter, MoreHorizontal, Download, ChevronDown } from "lucide-react";

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "orders"));
      const items = await Promise.all(
        querySnapshot.docs.map(async (docSnap) => {
          const orderData = docSnap.data();
          const userDoc = await getDoc(doc(db, "users", orderData.user_id));
          return {
            id: docSnap.id,
            ...orderData,
            user: userDoc.exists() ? userDoc.data() : { name: "Unknown User", email: "N/A" }
          };
        })
      );
      items.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setOrders(items);
    } catch (e) {
      console.error("Failed to fetch orders", e);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, status: string) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { status });
      fetchOrders();
    } catch (e) {
      console.error("Failed to update status", e);
    }
  };

  const confirmOrder = async (orderId: string) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { status: "Confirmed" });
      fetchOrders();
    } catch (e) {
      console.error("Failed to confirm order", e);
    }
  };

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      'Pending': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
      'Confirmed': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      'Awaiting Payment': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
      'Payment Submitted': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
      'Paid': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
      'Processing': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      'Out for Delivery': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400',
      'Ready for Pickup': 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400',
      'Delivered': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      'Cancelled': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toString().includes(searchTerm) || 
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === "All" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Order Management</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage and track all customer orders.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2 bg-white dark:bg-slate-900 dark:border-slate-800">
            <Download size={16} />
            Export
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-visible relative z-10">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search orders, customers..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-200"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative flex items-center gap-2">
              <Filter className="text-gray-400" size={18} />
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-sm font-medium text-gray-700 dark:text-gray-300 outline-none cursor-pointer appearance-none pr-6"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Paid">Paid</option>
                <option value="Processing">Processing</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <ChevronDown className="absolute right-0 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>
        </div>

        <div className="overflow-visible min-h-[300px]">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead className="bg-gray-50 dark:bg-slate-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Order</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex justify-center items-center gap-3">
                      <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      Loading orders...
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    No orders found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">#{order.id}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 font-medium text-xs">
                          {order.user?.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{order.user?.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{order.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'Just now'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        K{Number(order.total_amount).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 inline-flex text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        {order.status === 'Pending' && (
                          <Button 
                            size="sm" 
                            onClick={() => confirmOrder(order.id)} 
                            className="bg-blue-600 hover:bg-blue-700 text-white h-8"
                          >
                            Confirm
                          </Button>
                        )}
                        <div className="relative group/dropdown">
                          <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                            <MoreHorizontal size={18} />
                          </button>
                          
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 z-50 opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all">
                            <div className="p-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Update Status</div>
                            <div className="py-1 flex flex-col max-h-48 overflow-y-auto">
                              {['Pending', 'Confirmed', 'Paid', 'Processing', 'Delivered', 'Cancelled'].map(s => (
                                <button
                                  key={s}
                                  onClick={() => updateStatus(order.id, s)}
                                  className={`text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-slate-800 ${order.status === s ? 'text-blue-600 font-medium' : 'text-gray-700 dark:text-gray-300'}`}
                                >
                                  {s}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {!loading && filteredOrders.length > 0 && (
          <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>Showing <span className="font-medium text-gray-900 dark:text-white">{filteredOrders.length}</span> orders</span>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-50" disabled>Previous</button>
              <button className="px-3 py-1 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-50" disabled>Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
