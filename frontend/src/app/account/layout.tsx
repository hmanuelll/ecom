"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserCircle, Shield, Package, Heart, Globe, Lock, LogOut } from "lucide-react";
import { useStore } from "@/store/useStore";
import { api } from "@/lib/api";
import { Dialog } from "@radix-ui/react-dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "My Profile", href: "/account/profile", icon: UserCircle },
  { name: "Security", href: "/account/security", icon: Shield },
  { name: "Orders", href: "/account/orders", icon: Package },
  { name: "Wishlist", href: "/account/wishlist", icon: Heart },
  { name: "Theme", href: "/account/preferences", icon: Globe },
  { name: "Privacy", href: "/account/privacy", icon: Lock },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, setUser, clearCart } = useStore();
  const [isSignOutOpen, setIsSignOutOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch (e) {}
    localStorage.removeItem("access_token");
    setUser(null);
    clearCart();
    window.location.href = "/";
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#FAF9F6] dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-4 sticky top-24">
            <div className="p-4 mb-2 border-b border-gray-100 dark:border-slate-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Account</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">{user.email}</p>
            </div>
            
            <nav className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href || (pathname === "/account" && item.href === "/account/profile");
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive 
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400" 
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-500"}`} />
                    {item.name}
                  </Link>
                );
              })}
              
              <div className="pt-4 mt-4 border-t border-gray-100 dark:border-slate-800">
                <button
                  onClick={() => setIsSignOutOpen(true)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
                >
                  <LogOut className="w-5 h-5 text-red-500 dark:text-red-400" />
                  Sign Out
                </button>
              </div>
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1">
          {children}
        </main>
      </div>

      {isSignOutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm p-6 rounded-2xl shadow-xl animate-in fade-in zoom-in-95">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Sign Out</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Are you sure you want to sign out of your account?</p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsSignOutOpen(false)} className="px-5">Cancel</Button>
              <Button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white px-5">Yes, Sign Out</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
