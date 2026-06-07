"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  ShoppingCart, 
  Package, 
  Tag,
  BarChart3,
  Bot,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { api } from "@/lib/api";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/users", label: "Customers", icon: Users },
  { href: "/admin/promotions", label: "Promotions", icon: Tag },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
  { href: "/admin/feedback", label: "Feedback", icon: MessageSquare },
  { href: "/admin/chatbot", label: "AI Chatbot", icon: Bot },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ collapsed, setCollapsed }: { collapsed: boolean, setCollapsed: (val: boolean) => void }) {
  const pathname = usePathname();
  const { setUser, clearCart } = useStore();

  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch (e) {}
    localStorage.removeItem("access_token");
    setUser(null);
    clearCart();
    window.location.href = "/";
  };

  return (
    <aside 
      className={`bg-slate-900 text-slate-300 transition-all duration-300 flex flex-col relative ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="h-16 flex items-center justify-center border-b border-slate-800">
        {!collapsed && <span className="text-xl font-bold text-white tracking-wider">NEXUS<span className="text-blue-500">ADMIN</span></span>}
        {collapsed && <span className="text-xl font-bold text-blue-500">N</span>}
      </div>

      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 bg-slate-800 rounded-full p-1 border border-slate-700 hover:bg-slate-700 text-white z-10 hidden md:block"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
        <nav className="space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center px-3 py-3 rounded-lg transition-colors group ${
                  isActive 
                    ? "bg-blue-600/10 text-blue-400" 
                    : "hover:bg-slate-800 hover:text-white"
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon size={20} className={`shrink-0 ${isActive ? "text-blue-400" : "text-slate-400 group-hover:text-slate-300"}`} />
                {!collapsed && <span className="ml-3 font-medium text-sm">{item.label}</span>}
                {!collapsed && isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={handleLogout}
          className="flex items-center w-full px-3 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors"
        >
          <LogOut size={20} />
          {!collapsed && <span className="ml-3 font-medium text-sm">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
