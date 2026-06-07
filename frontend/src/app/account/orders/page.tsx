"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/store/useStore";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import Link from "next/link";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Package, ArrowRight, Truck } from "lucide-react";

export default function OrdersPage() {
  const { user } = useStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchOrders = async () => {
        try {
          const q = query(collection(db, "orders"), where("user_id", "==", user.id));
          const querySnapshot = await getDocs(q);
          const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
          
          // Sort in-memory by date (newest first)
          items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          setOrders(items);
        } catch (e) {
          console.error("Failed to load orders from Firestore:", e);
        } finally {
          setLoading(false);
        }
      };
      fetchOrders();
    }
  }, [user]);

  if (!user) return null;
  if (loading) return <LoadingSpinner text="Loading your orders..." />;

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
        case 'Confirmed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
        case 'Awaiting Payment': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
        case 'Payment Submitted': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400';
        case 'Paid': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
        case 'Processing': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
        case 'Out for Delivery': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
        case 'Ready for Pickup': return 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400';
        case 'Delivered': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
        case 'Cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
        default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      }
    };

  return (
    <div className="min-h-screen bg-[#FAF9F6] dark:bg-slate-950 transition-colors duration-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8">Order History</h1>
        
        {orders.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-12 text-center">
            <div className="w-20 h-20 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-10 h-10 text-gray-300 dark:text-gray-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No orders yet</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">When you place an order, it will appear here.</p>
            <Link href="/" className="inline-flex items-center text-blue-600 dark:text-blue-400 font-bold hover:text-blue-700 dark:hover:text-blue-300 active:scale-95 transition-transform">
              Start shopping <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden relative group">
                <div className="border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/50 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Order #{order.id.toString().padStart(6, '0')}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString()}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-extrabold text-lg text-gray-900 dark:text-white">K{Number(order.total_amount).toFixed(2)}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    {order.items.map((item: any) => (
                      <div key={item.id} className="flex items-center gap-4 py-2 border-b border-gray-50 dark:border-slate-800/50 last:border-0 last:pb-0">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-lg flex-shrink-0">
                          <img 
                            src={`https://via.placeholder.com/100x100.png?text=${encodeURIComponent(item.product.name)}`}
                            alt={item.product.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">{item.product.name}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-sm font-bold text-gray-900 dark:text-white">
                          K{Number(item.total_price).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {order.status === 'Out for Delivery' && (
                    <div className="mt-6 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-lg p-4 flex items-start">
                      <Truck className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-bold text-blue-900 dark:text-blue-100">Your order is arriving soon!</p>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">Our delivery partner is on the way to your shipping address.</p>
                      </div>
                    </div>
                  )}

                  <div className="mt-6 pt-6 border-t border-gray-100 dark:border-slate-800 flex justify-end">
                    <Link href={`/account/orders/${order.id}`}>
                      <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm hover:shadow transition-all">
                        {order.status === 'Awaiting Payment' ? 'Pay Now' : 'View Details'}
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
