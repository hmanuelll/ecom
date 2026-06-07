"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { AlertCircle, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await api.post("/forgot-password", { email });
      setStatus("success");
      setMessage(res.data.message || "Password reset link sent! Check your email.");
    } catch (err: any) {
      setStatus("error");
      setMessage(err.response?.data?.message || "Failed to send reset link. Please check the email address.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute top-8 left-8">
        <Link href="/login" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to login
        </Link>
      </div>

      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Forgot password?</h2>
          <p className="mt-2 text-sm text-gray-500">
            No worries, we'll send you reset instructions.
          </p>
        </div>

        {status === "success" ? (
          <div className="bg-green-50 p-4 rounded-xl flex flex-col items-center text-center space-y-3 border border-green-100">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
            <p className="text-sm text-green-800 font-medium">{message}</p>
            <p className="text-xs text-green-600">You can safely close this window.</p>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {status === "error" && (
              <div className="bg-red-50 p-4 rounded-lg flex items-start">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                <p className="text-sm text-red-700">{message}</p>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <Input
                type="email"
                required
                placeholder="you@example.com"
                className="h-12 bg-gray-50 border-gray-200 focus:bg-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <Button 
              type="submit" 
              disabled={status === "loading" || !email}
              className="w-full h-12 text-base font-bold bg-blue-600 hover:bg-blue-700 transition-colors rounded-lg shadow-md"
            >
              {status === "loading" ? "Sending..." : "Reset Password"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
