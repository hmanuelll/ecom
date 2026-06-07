"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

export default function PoliciesPage() {
  return (
    <div className="min-h-[70vh] bg-[#FAF9F6] py-20 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6">
        <ShieldCheck className="w-12 h-12 text-green-500" />
      </div>
      <h1 className="text-4xl font-extrabold text-gray-900 mb-4 text-center">Store Policies</h1>
      <p className="text-gray-500 mb-8 text-center max-w-2xl leading-relaxed">
        Learn about our return guidelines, shipping methods, and the strict R2v3 certification standards we follow to ensure the highest quality electronics.
      </p>
      <div className="flex gap-4">
        <button className="inline-flex items-center text-white bg-gray-900 font-bold hover:bg-gray-800 active:scale-95 transition-all px-8 py-4 rounded-xl shadow-sm hover:shadow-md">
          Download PDF Guide
        </button>
        <Link href="/" className="inline-flex items-center text-gray-900 font-bold hover:text-gray-700 active:scale-95 transition-transform bg-white border border-gray-200 px-8 py-4 rounded-xl shadow-sm hover:shadow-md">
          Return Home <ArrowRight className="ml-2 w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
