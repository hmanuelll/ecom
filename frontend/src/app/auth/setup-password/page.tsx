"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

export default function SetupPasswordPage() {
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const passwordsMatch = password !== "" && password === passwordConfirmation;
  const passwordHasLength = password.length >= 8;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordsMatch || !passwordHasLength) {
      setError("Please ensure your password meets the requirements.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await api.put("/user/setup-password", {
        password,
        password_confirmation: passwordConfirmation,
      });
      router.push("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to set password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Set Your Password</h2>
          <p className="mt-2 text-sm text-gray-600">
            Since you signed up with Google, please set a password for your account to use across devices.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 p-4 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
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

          <div className="pt-2">
            <Button 
              type="submit" 
              disabled={loading || !passwordsMatch || !passwordHasLength}
              className="w-full h-12 text-base font-bold bg-blue-600 hover:bg-blue-700 transition-colors rounded-lg shadow-md"
            >
              {loading ? "Saving..." : "Complete Setup"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
