"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Package, AlertCircle, Info } from "lucide-react";
import { api } from "@/lib/api";
import { useStore } from "@/store/useStore";
import Link from "next/link";

export function NotificationsDropdown() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const { user } = useStore();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data);
    } catch (e) {}
  };

  const markAsRead = async (id: string) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n));
    } catch (e) {}
  };

  const markAllAsRead = async () => {
    try {
      await api.put("/notifications/read-all");
      setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date().toISOString() })));
    } catch (e) {}
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'account_setup': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'order_placed': return <Package className="w-5 h-5 text-blue-500" />;
      default: return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read_at).length;

  if (!user) return null;

  return (
    <div className="relative flex items-center" ref={dropdownRef}>
      <button 
        onClick={() => setOpen(!open)}
        className="relative hover:text-blue-600 transition-colors focus:outline-none active:scale-90 flex items-center"
      >
        <Bell className="w-6 h-6" strokeWidth={2} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-[50px] w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-gray-100 dark:border-slate-800 z-50 overflow-hidden transform origin-top-right animate-in fade-in zoom-in-95 duration-200">
          <div className="p-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50 dark:bg-slate-800/50">
            <h3 className="font-bold text-gray-900 dark:text-white">Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="text-xs text-blue-600 hover:text-blue-400 font-medium cursor-pointer">
                Mark all as read
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3">
                  <Bell className="w-6 h-6 text-gray-300 dark:text-gray-600" />
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">No notifications yet</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">When you get updates, they'll show up here.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-slate-800">
                {notifications.map((notif) => (
                  <div 
                    key={notif.id} 
                    className={`p-4 flex gap-4 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${!notif.read_at ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                    onClick={() => markAsRead(notif.id)}
                  >
                    <div className="flex-shrink-0 mt-1">
                      {getIcon(notif.data.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium text-gray-900 dark:text-white ${!notif.read_at ? 'font-bold' : ''}`}>
                        {notif.data.title}
                      </p>
                      <p className={`text-sm mt-0.5 line-clamp-2 ${!notif.read_at ? 'text-gray-700 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400'}`}>
                        {notif.data.message}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5 font-medium">
                        {new Date(notif.created_at).toLocaleDateString()} at {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    {!notif.read_at && (
                      <div className="flex-shrink-0 mt-2">
                        <div className="w-2.5 h-2.5 bg-blue-600 rounded-full shadow-sm"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
