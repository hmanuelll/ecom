"use client";

import { Settings, ShieldCheck, Globe, Database, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminSettings() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">System Settings</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Configure global platform preferences and integrations.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <div className="col-span-1 space-y-2">
          {[
            { id: "general", label: "General", icon: Globe, active: true },
            { id: "security", label: "Security", icon: ShieldCheck, active: false },
            { id: "billing", label: "Billing", icon: CreditCard, active: false },
            { id: "database", label: "Database", icon: Database, active: false }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  item.active 
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" 
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="col-span-1 md:col-span-3 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-8 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-transparent dark:from-slate-800/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 relative">
              <div className="absolute inset-0 bg-gray-100 dark:bg-slate-700 rounded-full animate-ping opacity-20"></div>
              <Settings className="text-gray-400 dark:text-gray-500 w-10 h-10" />
            </div>
            
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Centralized Configuration Hub</h2>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-8">
              The unified settings panel with API key management, webhook configuration, and payment gateway setup will be available here.
            </p>
            
            <Button variant="outline" className="dark:border-slate-700 dark:text-gray-300">
              Notify me when ready
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
