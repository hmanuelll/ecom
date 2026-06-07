"use client";

import { 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign, 
  Users, 
  ShoppingCart, 
  Activity,
  MoreVertical
} from "lucide-react";

// stats will be computed dynamically now

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminOrders = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "orders"));
        const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOrders(items);
      } catch (e) {
        console.error("Failed to load admin orders:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminOrders();
  }, []);

  const totalRevenue = orders.reduce((acc, order) => acc + Number(order.total_amount), 0);
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  
  const stats = [
    { 
      title: "Total Revenue", 
      value: `K${totalRevenue.toFixed(2)}`, 
      change: "+0.0%", 
      isPositive: true, 
      icon: DollarSign,
      color: "bg-emerald-500/10 text-emerald-500"
    },
    { 
      title: "Orders", 
      value: `${orders.length}`, 
      change: "+0.0%", 
      isPositive: true, 
      icon: ShoppingCart,
      color: "bg-blue-500/10 text-blue-500"
    },
    { 
      title: "Pending Orders", 
      value: `${pendingOrders}`, 
      change: "+0.0%", 
      isPositive: true, 
      icon: Activity,
      color: "bg-amber-500/10 text-amber-500"
    },
    { 
      title: "New Customers", 
      value: "...", 
      change: "+0.0%", 
      isPositive: true, 
      icon: Users,
      color: "bg-purple-500/10 text-purple-500"
    }
  ];

  if (loading) return <div className="p-8">Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Here's what's happening with your store today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors shadow-sm">
            Download Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <Icon size={24} />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${stat.isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                  {stat.isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                  <span>{stat.change}</span>
                </div>
              </div>
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{stat.title}</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
              
              <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-gradient-to-br from-transparent to-black/5 dark:to-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
            </div>
          );
        })}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">Revenue Analytics</h2>
            <select className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 text-sm rounded-lg px-3 py-1.5 outline-none dark:text-gray-200">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>This Year</option>
            </select>
          </div>
          
          {/* Mock Chart using CSS */}
          <div className="h-64 flex items-end justify-between gap-2 px-2">
            {[40, 70, 45, 90, 65, 85, 120].map((height, i) => (
              <div key={i} className="w-full flex flex-col items-center gap-2 group">
                <div className="w-full bg-blue-100 dark:bg-blue-900/30 rounded-t-md relative flex items-end justify-center transition-all duration-300 hover:bg-blue-200 dark:hover:bg-blue-800/50" style={{ height: '100%' }}>
                  <div 
                    className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-md relative group-hover:from-blue-500 group-hover:to-blue-300 transition-colors" 
                    style={{ height: `${(height / 120) * 100}%` }}
                  >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                      ${height}k
                    </div>
                  </div>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">Recent Sales</h2>
            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <MoreVertical size={20} />
            </button>
          </div>
          <div className="space-y-6">
            {[
              { name: "Olivia Martin", email: "olivia.martin@email.com", amount: "+$1,999.00", img: "OM" },
              { name: "Jackson Lee", email: "jackson.lee@email.com", amount: "+$39.00", img: "JL" },
              { name: "Isabella Nguyen", email: "isabella.nguyen@email.com", amount: "+$299.00", img: "IN" },
              { name: "William Kim", email: "will@email.com", amount: "+$99.00", img: "WK" },
              { name: "Sofia Davis", email: "sofia.davis@email.com", amount: "+$39.00", img: "SD" }
            ].map((sale, i) => (
              <div key={i} className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-sm font-semibold text-slate-600 dark:text-slate-300 group-hover:scale-105 transition-transform">
                    {sale.img}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white leading-none">{sale.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{sale.email}</p>
                  </div>
                </div>
                <div className="text-sm font-bold text-gray-900 dark:text-white">
                  {sale.amount}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
