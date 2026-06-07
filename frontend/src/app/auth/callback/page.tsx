"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { useStore } from "@/store/useStore";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const isNew = searchParams.get("is_new");
  const setUser = useStore((state) => state.setUser);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError("No authentication token found. Please try logging in again.");
      setTimeout(() => router.push("/login"), 3000);
      return;
    }

    const authenticate = async () => {
      localStorage.setItem("access_token", token);
      try {
        const res = await api.get("/user");
        setUser(res.data);
        if (isNew === '1') {
          router.push("/auth/setup-password");
        } else if (res.data.role === 'admin') {
          router.push("/admin");
        } else {
          router.push("/");
        }
      } catch (err) {
        console.error("Failed to fetch user data after OAuth:", err);
        setError("Failed to fetch user profile. Please try logging in again.");
        localStorage.removeItem("access_token");
        setTimeout(() => router.push("/login"), 3000);
      }
    };

    authenticate();
  }, [token, router, setUser]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Authentication Failed</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return <LoadingSpinner text="Completing sign in..." />;
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<LoadingSpinner text="Authenticating..." />}>
      <AuthCallback />
    </Suspense>
  );
}
