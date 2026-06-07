"use client";

import { useStore } from "@/store/useStore";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";

export default function PreferencesPage() {
  const { user } = useStore();
  if (!user) return null;

  return (
    <div className="bg-white dark:bg-slate-900 shadow-sm rounded-2xl border border-gray-100 dark:border-slate-800 overflow-hidden min-h-[400px] flex flex-col">
      <div className="px-8 py-6 border-b border-gray-100 dark:border-slate-800">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Theme</h1>
      </div>
      
      <div className="divide-y divide-gray-100 dark:divide-slate-800">
        <div className="px-8 py-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="text-sm font-bold text-gray-900 dark:text-white">Theme Preference</div>
          <div className="md:col-span-2 flex justify-between items-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm">
              Customize the appearance of your interface. You can switch between light mode, dark mode, or follow your system settings.
            </p>
            <ThemeSwitcher />
          </div>
        </div>

      </div>
    </div>
  );
}
