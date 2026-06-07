"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { AlertCircle, ArrowRight } from "lucide-react";

import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setUser = useStore((state) => state.setUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      const role = userDoc.exists() ? userDoc.data().role : "customer";
      
      if (role === 'admin') {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      let msg = "Login failed. Please check your credentials.";
      if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        msg = "Invalid email or password.";
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const userDocRef = doc(db, "users", userCredential.user.uid);
      const userDoc = await getDoc(userDocRef);
      let role = "customer";
      
      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          name: userCredential.user.displayName || "User",
          email: userCredential.user.email,
          role: "customer",
          phone: "",
          addresses: [],
        });
      } else {
        role = userDoc.data().role || "customer";
      }

      if (role === 'admin') {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message || "Google sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side: Decorative/Brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-700 p-12 text-white flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-700 to-indigo-900" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50" />
        <div className="absolute right-0 top-1/4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50" />
        
        <div className="relative z-10">
          <Link href="/" className="text-3xl font-extrabold tracking-tight">TechStore.</Link>
        </div>
        <div className="relative z-10 mb-20">
          <h1 className="text-5xl font-bold mb-6 leading-tight">Welcome back.</h1>
          <p className="text-blue-100 text-lg max-w-md">Log in to track your orders, access your wishlist, and check out faster.</p>
        </div>
        <div className="relative z-10 text-sm text-blue-200">
          © {new Date().getFullYear()} TechStore. All rights reserved.
        </div>
      </div>

      {/* Right side: Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-white relative">
        <div className="mx-auto w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Link href="/" className="text-3xl font-extrabold text-blue-600 tracking-tight">TechStore.</Link>
          </div>
          
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 tracking-tight">Sign in to your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
              Sign up here <ArrowRight className="inline w-4 h-4" />
            </Link>
          </p>

          <div className="mt-8" suppressHydrationWarning>
            <form className="space-y-6" onSubmit={handleSubmit} suppressHydrationWarning>
              {error && (
                <div className="bg-red-50 p-4 rounded-lg flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
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

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <Link href="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="h-12 bg-gray-50 border-gray-200 focus:bg-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="pt-2">
                <Button 
                  type="submit" 
                  disabled={loading || !email || !password}
                  className="w-full h-12 text-base font-bold bg-blue-600 hover:bg-blue-700 transition-colors rounded-lg shadow-md cursor-pointer"
                >
                  {loading ? "Signing in..." : "Sign in"}
                </Button>
              </div>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full flex justify-center items-center h-12 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-base font-bold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Google
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
