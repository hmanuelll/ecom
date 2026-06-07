"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { CircleUser, Search, Bookmark, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { SidebarMenu } from "./SidebarMenu";
import { CartPanel } from "./CartPanel";
import { LogoutModal } from "./LogoutModal";
import { TopToast } from "@/components/ui/TopToast";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import { NotificationsDropdown } from "./NotificationsDropdown";

export function Navbar() {
  const { user, setUser, clearCart } = useStore();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const currentCategory = searchParams.get("category");
  
  const [searchQuery, setSearchQuery] = useState("");
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setRecommendations([]);
      setShowDropdown(false);
      return;
    }
    const delayDebounceFn = setTimeout(() => {
      api.get(`/products?search=${searchQuery}`).then((res) => {
        const data = res.data.data || res.data;
        setRecommendations(data.slice(0, 5)); // Show top 5
        setShowDropdown(true);
      }).catch(() => {});
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);
  
  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch (e) {}
    localStorage.removeItem("access_token");
    setUser(null);
    clearCart();
    window.location.href = "/";
  };

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <TopToast />
      <LogoutModal open={logoutModalOpen} onOpenChange={setLogoutModalOpen} onConfirm={handleLogout} />

      <nav className="bg-[#FAF9F6] dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 sticky top-0 z-40 transition-colors duration-300">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-[72px] items-center">
            
            {/* Left Section: Logo & Inline Links */}
            <div className="flex items-center">
              <div className="mr-4 mt-1">
                <SidebarMenu onLogoutClick={() => setLogoutModalOpen(true)} />
              </div>
              <Link href="/" className="text-2xl font-extrabold text-blue-600 tracking-tight mr-10 italic flex items-center hover:scale-105 transition-transform active:scale-95">
                <span className="text-xl mr-1">🍍</span>
                TechStore
              </Link>
              
              {/* Desktop Inline Links */}
              <div className="hidden lg:flex items-center space-x-6 text-[15px] font-bold text-gray-500 dark:text-gray-300">
                <Link href="/products?category=featured" className={`hover:text-blue-600 transition-colors py-5 border-b-2 ${currentCategory === 'featured' ? 'border-blue-600 text-gray-900 dark:text-white' : 'border-transparent'}`}>Featured</Link>
                <Link href="/products?category=laptops" className={`hover:text-blue-600 transition-colors py-5 border-b-2 ${currentCategory === 'laptops' ? 'border-blue-600 text-gray-900 dark:text-white' : 'border-transparent'}`}>Laptops</Link>
                <Link href="/products?category=smartphones" className={`hover:text-blue-600 transition-colors py-5 border-b-2 ${currentCategory === 'smartphones' ? 'border-blue-600 text-gray-900 dark:text-white' : 'border-transparent'}`}>Phones</Link>
                <Link href="/products?category=gaming" className={`hover:text-blue-600 transition-colors py-5 border-b-2 ${currentCategory === 'gaming' ? 'border-blue-600 text-gray-900 dark:text-white' : 'border-transparent'}`}>Gaming</Link>
                <Link href="/products?category=accessories" className={`hover:text-blue-600 transition-colors py-5 border-b-2 ${currentCategory === 'accessories' ? 'border-blue-600 text-gray-900 dark:text-white' : 'border-transparent'}`}>Accessories</Link>
              </div>
            </div>

              {/* Search, Wishlist, Profile & Cart Icons */}
              <div className="flex items-center space-x-6 sm:space-x-8 shrink-0 text-[#1A2521] dark:text-gray-200">
                
                {/* Search Bar */}
                <div className="hidden md:block w-48 lg:w-64 relative">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input 
                      type="text" 
                      placeholder="Search: Laptops" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => { if(recommendations.length > 0) setShowDropdown(true) }}
                      onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                      className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-full text-sm text-gray-900 dark:text-white dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    />
                  </div>

                  {/* Recommendations Dropdown */}
                  {showDropdown && recommendations.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl shadow-lg z-50 overflow-hidden">
                      {recommendations.map(product => (
                        <div 
                          key={product.id} 
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setShowDropdown(false);
                            setSearchQuery("");
                            router.push(`/products/${product.id}`);
                          }}
                          className="flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors border-b border-gray-50 dark:border-slate-800/50 last:border-0 cursor-pointer"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{product.name}</p>
                            <p className="text-xs text-gray-500 truncate mt-0.5">K{Number(product.price).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                      <div 
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setShowDropdown(false);
                          const query = searchQuery;
                          setSearchQuery("");
                          router.push(`/products?search=${query}`);
                        }}
                        className="block px-4 py-3 text-xs font-bold text-center text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 bg-gray-50 dark:bg-slate-800/30 transition-colors cursor-pointer"
                      >
                        View all results for "{searchQuery}"
                      </div>
                    </div>
                  )}
                </div>

                {/* Theme Switcher */}
                <div className="hidden md:flex">
                  <ThemeSwitcher />
                </div>

                {/* Wishlist Icon */}
                <Link href="/wishlist" className="hover:text-red-500 dark:text-gray-300 dark:hover:text-red-400 transition-colors focus:outline-none active:scale-90 flex items-center">
                  <Bookmark className="w-6 h-6" strokeWidth={2} />
                </Link>

                {/* Profile Icon */}
                {user ? (
                  <div className="relative group py-5 flex items-center">
                    <Link href="/account" className="hover:text-blue-600 transition-colors focus:outline-none flex items-center active:scale-90">
                      <CircleUser className="w-6 h-6" strokeWidth={2} />
                    </Link>
                    
                    {/* Hover Dropdown */}
                    <div className="absolute right-0 top-[60px] w-48 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-gray-100 dark:border-slate-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right group-hover:translate-y-0 translate-y-2 z-50">
                      <div className="p-4 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/50 rounded-t-xl">
                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                      </div>
                      <div className="p-2 flex flex-col">
                        {user.role === 'admin' && (
                          <Link href="/admin" className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-400 rounded-md transition-colors">Admin Dashboard</Link>
                        )}
                        <Link href="/account" className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-400 rounded-md transition-colors">Account Settings</Link>
                        {user.role !== 'admin' && (
                          <Link href="/account/orders" className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-400 rounded-md transition-colors">Order History</Link>
                        )}
                        <button onClick={() => setLogoutModalOpen(true)} className="text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors mt-1 border-t border-gray-100 dark:border-slate-800 pt-3">
                          Log out
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link href="/login" className="hover:text-blue-600 transition-colors focus:outline-none active:scale-90 flex items-center">
                    <CircleUser className="w-6 h-6" strokeWidth={2} />
                  </Link>
                )}

                {/* Notifications Icon */}
                <NotificationsDropdown />

                {/* Cart Icon */}
                <div className="active:scale-90 transition-transform flex items-center">
                  <CartPanel />
                </div>
              </div>

          </div>
        </div>
      </nav>
    </>
  );
}
