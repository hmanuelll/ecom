"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { MessageSquare, User, Clock } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const res = await api.get("/admin/feedback");
      setFeedbacks(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="bg-white dark:bg-slate-900 shadow-sm rounded-xl border border-gray-100 dark:border-slate-800 overflow-hidden min-h-[400px]">
      <div className="px-6 py-5 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-600" />
          Customer Feedback
        </h2>
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900/30 dark:text-blue-300">
          {feedbacks.length} Total
        </span>
      </div>

      {feedbacks.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <MessageSquare className="w-12 h-12 text-gray-300 dark:text-slate-700 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No feedback yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Customer ideas and issues will appear here.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100 dark:divide-slate-800">
          {feedbacks.map((f) => (
            <div key={f.id} className="p-6 hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {f.is_anonymous ? "Anonymous Customer" : (f.user?.name || "Unknown User")}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {!f.is_anonymous && f.user?.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center text-xs text-gray-400 dark:text-gray-500">
                  <Clock className="w-3 h-3 mr-1" />
                  {new Date(f.created_at).toLocaleDateString()}
                </div>
              </div>
              
              <div className="pl-10">
                <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap bg-gray-50 dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700">
                  {f.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
