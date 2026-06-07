"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { MessageSquare, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useStore } from "@/store/useStore";

export function FeedbackModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const { showToast } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    setStatus("loading");
    try {
      await api.post("/feedback", { content, is_anonymous: isAnonymous });
      setStatus("success");
      showToast("Thank you for your feedback!", "success");
      setTimeout(() => {
        setStatus("idle");
        setContent("");
        setIsAnonymous(false);
        onOpenChange(false);
      }, 1500);
    } catch (error) {
      setStatus("error");
      showToast("Failed to submit feedback", "error");
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity" />
        <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[90vw] max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Send Feedback
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Share your ideas or issues
              </label>
              <textarea
                required
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What could we improve?"
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none transition-colors"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="anonymous"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
              />
              <label htmlFor="anonymous" className="text-sm text-gray-600 dark:text-gray-400 select-none cursor-pointer">
                Submit anonymously
              </label>
            </div>

            <Button 
              type="submit" 
              disabled={status === "loading" || !content.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              {status === "loading" ? "Sending..." : "Send Feedback"}
            </Button>
            
            {status === "success" && (
              <p className="text-sm text-green-600 dark:text-green-400 text-center font-medium animate-pulse">
                Sent successfully!
              </p>
            )}
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
