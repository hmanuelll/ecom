"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Trash2, ExternalLink, AlertTriangle } from "lucide-react";
import { api } from "@/lib/api";

export default function PrivacyPage() {
  const { user, setUser, clearCart, showToast } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const handleDelete = async () => {
    if (!password) {
      showToast("Please enter your password", "error");
      return;
    }
    setLoading(true);
    try {
      await api.delete("/user/account", { data: { password } });
      setUser(null);
      clearCart();
      showToast("Account deleted successfully.", "success");
      window.location.href = "/";
    } catch (e: any) {
      showToast(e.response?.data?.message || "Failed to delete account.", "error");
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 shadow-sm rounded-2xl border border-gray-100 dark:border-slate-800 overflow-hidden min-h-[400px]">
      <div className="px-8 py-6 border-b border-gray-100 dark:border-slate-800">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Privacy & Data</h1>
      </div>
      
      <div className="divide-y divide-gray-100 dark:divide-slate-800">
        <div className="px-8 py-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Manage your data</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 max-w-2xl">
            You have full control over the personal data you share with TechStore. We are committed to keeping your information safe and secure.
          </p>

          <div className="space-y-4 max-w-3xl">
            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-slate-700 rounded-xl">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Download className="w-4 h-4 text-blue-600" /> Download your data
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Get a copy of your personal data, order history, and preferences.</p>
              </div>
              <Button variant="outline">Request Archive</Button>
            </div>

            <div className="flex items-center justify-between p-4 border border-red-100 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10 rounded-xl">
              <div>
                <h3 className="font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                  <Trash2 className="w-4 h-4" /> Delete Account
                </h3>
                <p className="text-sm text-red-500/80 dark:text-red-400/80 mt-1">Permanently delete your account and erase all your data from our servers.</p>
              </div>
              <Button onClick={() => setShowModal(true)} variant="destructive" className="bg-red-600 hover:bg-red-700 text-white cursor-pointer">Delete Account</Button>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-100 dark:border-slate-800 animate-in fade-in zoom-in-95">
              <div className="flex items-center gap-3 text-red-600 dark:text-red-500 mb-4">
                <AlertTriangle className="w-6 h-6" />
                <h2 className="text-xl font-bold">Delete Account?</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
                This action is permanent and cannot be undone. All your order history, personal data, and preferences will be erased.
                Please enter your password to confirm.
              </p>
              
              <Input 
                type="password" 
                placeholder="Enter your password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mb-6 dark:bg-slate-800 dark:border-slate-700"
              />

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowModal(false)} className="dark:bg-slate-800 dark:border-slate-700 cursor-pointer">
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDelete} disabled={loading} className="bg-red-600 hover:bg-red-700 text-white cursor-pointer">
                  {loading ? "Deleting..." : "Confirm Deletion"}
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="px-8 py-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Privacy Policies</h2>
          <div className="space-y-3">
            <a href="#" className="flex items-center text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium">
              Terms of Service <ExternalLink className="w-3 h-3 ml-1" />
            </a>
            <a href="#" className="flex items-center text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium">
              Privacy Policy <ExternalLink className="w-3 h-3 ml-1" />
            </a>
            <a href="#" className="flex items-center text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium">
              Cookie Policy <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
