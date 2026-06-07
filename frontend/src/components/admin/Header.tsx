"use client";

import { useState } from "react";
import { Search, Bell, Sun, Moon, User } from "lucide-react";

export function Header({ 
  toggleDarkMode, 
  isDarkMode 
}: { 
  toggleDarkMode: () => void, 
  isDarkMode: boolean 
}) {
  const [notifications] = useState([1, 2, 3]);

  return (
    <header className="h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 flex items-center justify-between px-6 transition-colors duration-200 sticky top-0 z-10">
      <div className="flex items-center w-96 relative group">
        <Search className="absolute left-3 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
        <input 
          type="text" 
          placeholder="Search global (press Ctrl+K)..." 
          className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-slate-800 border-transparent focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 rounded-full text-sm outline-none transition-all dark:text-gray-200"
        />
      </div>

      <div className="flex items-center space-x-4">
        <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-300 transition-colors">
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-300 transition-colors relative">
          <Bell size={20} />
          {notifications.length > 0 && (
            <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-900 animate-pulse"></span>
          )}
        </button>

        <div className="h-8 w-px bg-gray-200 dark:bg-gray-800 mx-2"></div>

        <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white shadow-md border-2 border-white dark:border-slate-800">
            <User size={18} />
          </div>
        </button>
      </div>
    </header>
  );
}
