"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const passwordsMatch = password !== "" && password === passwordConfirmation;
  const passwordHasLength = password.length >= 8;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordsMatch || !passwordHasLength) return;
    
    setStatus("loading");
    setMessage("");

    try {
      const res = await api.post("/reset-password", {
        token,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      setStatus("success");
      setMessage(res.data.message || "Password has been successfully reset!");
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: any) {
      setStatus("error");
      setMessage(err.response?.data?.message || "Failed to reset password. The link might be expired.");
    }
  };

  if (!token || !email) {
    return (
      <div className="text-center text-red-500 p-4">
        Invalid password reset link.
      </div>
    );
  }

  return (
    <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Set new password</h2>
        <p className="mt-2 text-sm text-gray-500">
          Must be at least 8 characters.
        </p>
      </div>

      {status === "success" ? (
        <div className="bg-green-50 p-4 rounded-xl flex flex-col items-center text-center space-y-3 border border-green-100">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
          <p className="text-sm text-green-800 font-medium">{message}</p>
          <p className="text-xs text-green-600">Redirecting to login...</p>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <Input
              type="password"
              required
              placeholder="••••••••"
              className="h-12 bg-gray-50 border-gray-200 focus:bg-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {password.length > 0 && (
              <div className={`mt-2 text-xs flex items-center ${passwordHasLength ? 'text-green-600' : 'text-gray-500'}`}>
                {passwordHasLength ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <div className="w-3 h-3 border rounded-full mr-1" />}
                At least 8 characters
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <div className="relative">
              <Input
                type="password"
                required
                placeholder="••••••••"
                className={`h-12 bg-gray-50 pr-10 focus:bg-white ${passwordConfirmation.length > 0 ? (passwordsMatch ? 'border-green-500 focus:border-green-500 focus:ring-green-500' : 'border-red-300 focus:border-red-500 focus:ring-red-500') : 'border-gray-200'}`}
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
              />
              {passwordConfirmation.length > 0 && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  {passwordsMatch ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
              )}
            </div>
            {passwordConfirmation.length > 0 && (
              <p className={`mt-2 text-xs font-medium flex items-center ${passwordsMatch ? 'text-green-600' : 'text-red-500'}`}>
                {passwordsMatch ? (
                  <><CheckCircle2 className="w-3 h-3 mr-1" /> Passwords match!</>
                ) : (
                  <><AlertCircle className="w-3 h-3 mr-1" /> Passwords do not match.</>
                )}
              </p>
            )}
          </div>

          <Button 
            type="submit" 
            disabled={status === "loading" || !passwordsMatch || !passwordHasLength}
            className="w-full h-12 text-base font-bold bg-blue-600 hover:bg-blue-700 transition-colors rounded-lg shadow-md"
          >
            {status === "loading" ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="text-center text-gray-500">Loading verification details...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
