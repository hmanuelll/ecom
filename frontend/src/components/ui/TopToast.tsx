"use client";

import { useStore } from "@/store/useStore";
import { CheckCircle2, X, AlertCircle, Info } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";

export function TopToast() {
  const { toast, hideToast } = useStore();

  if (!toast.visible) return null;

  const bgColors = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-slate-800'
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] flex justify-center mt-4 pointer-events-none px-4">
      <div className={`${bgColors[toast.type]} text-white px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-10 fade-in duration-300 pointer-events-auto`}>
        {icons[toast.type]}
        <span className="font-medium">{toast.message}</span>
        <button onClick={hideToast} className={`ml-4 hover:bg-white/20 rounded-full p-1 transition-colors cursor-pointer`}>
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
