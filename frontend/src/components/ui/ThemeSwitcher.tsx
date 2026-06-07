"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Prevent hydration mismatch by rendering an empty placeholder
    return <div className="w-[104px] h-10 bg-gray-100 dark:bg-gray-800 rounded-full animate-pulse" />;
  }

  return (
    <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full p-1 border border-gray-200 dark:border-gray-700 shadow-inner">
      <button
        onClick={() => setTheme("light")}
        className={`p-2 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out cursor-pointer ${
          theme === "light"
            ? "bg-white dark:bg-gray-700 text-yellow-500 shadow-sm scale-100 rotate-0"
            : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 scale-90 -rotate-45"
        }`}
        aria-label="Light Mode"
      >
        <Sun className="w-4 h-4" />
      </button>

      <button
        onClick={() => setTheme("system")}
        className={`p-2 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out cursor-pointer ${
          theme === "system"
            ? "bg-white dark:bg-gray-700 text-blue-500 shadow-sm scale-100"
            : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 scale-90 opacity-70"
        }`}
        aria-label="System Theme"
      >
        <Monitor className="w-4 h-4" />
      </button>

      <button
        onClick={() => setTheme("dark")}
        className={`p-2 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out cursor-pointer ${
          theme === "dark"
            ? "bg-white dark:bg-gray-700 text-indigo-400 shadow-sm scale-100 rotate-0"
            : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 scale-90 rotate-45"
        }`}
        aria-label="Dark Mode"
      >
        <Moon className="w-4 h-4" />
      </button>
    </div>
  );
}
