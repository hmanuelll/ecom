"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { CheckCircle2, XCircle, AlertCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  
  const [phone, setPhone] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [city, setCity] = useState("");
  const [stateRegion, setStateRegion] = useState("");
  const [zipCode, setZipCode] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const passwordsMatch = password !== "" && password === passwordConfirmation;
  const passwordHasLength = password.length >= 8;

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordsMatch || !passwordHasLength) {
      setError("Please ensure your password meets the requirements.");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userDocRef = doc(db, "users", userCredential.user.uid);
      await setDoc(userDocRef, {
        name,
        email,
        role: "customer",
        phone,
        addresses: addressLine1 ? [{
          address_line1: addressLine1,
          city,
          state: stateRegion,
          zip_code: zipCode,
          country: "Zambia"
        }] : []
      });
      router.push("/login");
    } catch (err: any) {
      let msg = err.message || "Registration failed";
      if (err.code === "auth/email-already-in-use") {
        msg = "The email address is already in use.";
      } else if (err.code === "auth/invalid-email") {
        msg = "Invalid email address.";
      } else if (err.code === "auth/weak-password") {
        msg = "The password is too weak.";
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const skipAndComplete = async () => {
    setError("");
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userDocRef = doc(db, "users", userCredential.user.uid);
      await setDoc(userDocRef, {
        name,
        email,
        role: "customer",
        phone: "",
        addresses: []
      });
      router.push("/login");
    } catch (err: any) {
      let msg = err.message || "Registration failed";
      if (err.code === "auth/email-already-in-use") {
        msg = "The email address is already in use.";
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {loading && <LoadingSpinner text="Creating your account..." />}
      {/* Left side */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-700 p-12 text-white flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-700 to-indigo-900" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50" />
        <div className="absolute right-0 top-1/4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50" />
        
        <div className="relative z-10">
          <Link href="/" className="text-3xl font-extrabold tracking-tight">TechStore.</Link>
        </div>
        <div className="relative z-10 mb-20">
          <h1 className="text-5xl font-bold mb-6 leading-tight">Join the next generation of electronics.</h1>
          <p className="text-blue-100 text-lg max-w-md">Create an account to track your orders, save your wishlist, and get exclusive access to deals.</p>
        </div>
        <div className="relative z-10 text-sm text-blue-200">
          © {new Date().getFullYear()} TechStore. All rights reserved.
        </div>
      </div>

      {/* Right side */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-white relative">
        <div className="mx-auto w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Link href="/" className="text-3xl font-extrabold text-blue-600 tracking-tight">TechStore.</Link>
          </div>
          
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 tracking-tight">
            {step === 1 ? "Create an account" : "Complete your profile"}
          </h2>
          <p className="mt-2 text-sm text-gray-600 mb-8">
            {step === 1 ? (
              <>
                Already a member?{' '}
                <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                  Sign in here <ArrowRight className="inline w-4 h-4" />
                </Link>
              </>
            ) : (
              "Add your shipping details to speed up checkout later."
            )}
          </p>

          <div suppressHydrationWarning>
            {error && (
              <div className="bg-red-50 p-4 rounded-lg flex items-start mb-6">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            
            {step === 1 ? (
              <form className="space-y-5" onSubmit={handleNext}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <Input type="text" required placeholder="Full name" className="h-12 bg-gray-50 focus:bg-white" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                  <Input type="email" required placeholder="you@example.com" className="h-12 bg-gray-50 focus:bg-white" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <Input type="password" required placeholder="••••••••" className="h-12 bg-gray-50 focus:bg-white" value={password} onChange={(e) => setPassword(e.target.value)} />
                  {password.length > 0 && (
                    <div className={`mt-2 text-xs flex items-center ${passwordHasLength ? 'text-green-600' : 'text-gray-500'}`}>
                      {passwordHasLength ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <div className="w-3 h-3 border rounded-full mr-1" />} At least 8 characters
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                  <div className="relative">
                    <Input type="password" required placeholder="••••••••" className={`h-12 bg-gray-50 pr-10 focus:bg-white ${passwordConfirmation.length > 0 ? (passwordsMatch ? 'border-green-500 ring-green-500' : 'border-red-300 ring-red-500') : 'border-gray-200'}`} value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} />
                  </div>
                </div>
                <Button type="submit" disabled={!passwordsMatch || !passwordHasLength} className="w-full h-12 text-base font-bold bg-blue-600 hover:bg-blue-700 transition-colors rounded-lg shadow-md mt-4">
                  Next <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            ) : (
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number (Optional)</label>
                  <Input type="tel" placeholder="e.g. 097xxxxxxx" className="h-12 bg-gray-50 focus:bg-white" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
                  <Input type="text" placeholder="123 Main St" className="h-12 bg-gray-50 focus:bg-white" value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <Input type="text" placeholder="Lusaka" className="h-12 bg-gray-50 focus:bg-white" value={city} onChange={(e) => setCity(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Province / State</label>
                    <Input type="text" placeholder="Lusaka Province" className="h-12 bg-gray-50 focus:bg-white" value={stateRegion} onChange={(e) => setStateRegion(e.target.value)} />
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setStep(1)} className="h-12 px-4 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 flex items-center justify-center">
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <Button type="submit" className="flex-1 h-12 text-base font-bold bg-blue-600 hover:bg-blue-700 transition-colors rounded-lg shadow-md">
                    Complete Registration
                  </Button>
                </div>
                <div className="text-center mt-4">
                  <button type="button" onClick={skipAndComplete} className="text-sm text-gray-500 hover:text-blue-600 underline">
                    Skip and complete later
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
