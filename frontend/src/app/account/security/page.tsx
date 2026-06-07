"use client";

import { useStore } from "@/store/useStore";

export default function SecurityPage() {
  const { user } = useStore();
  if (!user) return null;

  return (
    <div className="bg-white dark:bg-slate-900 shadow-sm rounded-2xl border border-gray-100 dark:border-slate-800 overflow-hidden min-h-[400px] flex flex-col">
      <div className="px-8 py-6 border-b border-gray-100 dark:border-slate-800">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Security</h1>
      </div>
      <div className="flex-1 flex items-center justify-center p-8 text-center">
        <div>
          <h2 className="text-xl font-medium text-gray-900 dark:text-gray-200 mb-2">Security Settings</h2>
          <p className="text-gray-500 dark:text-gray-400">Password management and two-factor authentication coming soon.</p>
        </div>
      </div>
    </div>
  );
}
