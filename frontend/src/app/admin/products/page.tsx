"use client";

import { Package, Plus, Filter, Search, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminProducts() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Product Management</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage your catalog, inventory, and pricing.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center gap-2">
            <Plus size={18} />
            Add Product
          </Button>
        </div>
      </div>

      {/* Premium Empty State / Coming Soon */}
      <div className="mt-8 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col items-center justify-center py-24 relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        
        <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6 relative">
          <div className="absolute inset-0 bg-blue-100 dark:bg-blue-800/30 rounded-full animate-ping opacity-20"></div>
          <Package className="text-blue-500 w-10 h-10" />
        </div>
        
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Advanced Product Grid</h2>
        <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-8">
          The new comprehensive product management interface with bulk actions and rich variants is currently under development.
        </p>
        
        <Button variant="outline" className="dark:border-slate-700 dark:text-gray-300">
          Notify me when ready
        </Button>
      </div>
    </div>
  );
}
