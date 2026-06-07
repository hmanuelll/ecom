"use client";

import Link from "next/link";
import { ArrowRight, Info } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-[70vh] bg-[#FAF9F6] py-20 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
        <Info className="w-12 h-12 text-blue-500" />
      </div>
      <h1 className="text-4xl font-extrabold text-gray-900 mb-4 text-center">About Us</h1>
      <p className="text-gray-500 mb-8 text-center max-w-2xl leading-relaxed">
        We are a consumer electronics provider that connects people to reliable, Certified Pre-Owned Devices. 
        We make it affordable and easy for you to get the most out of your personal technology purchases.
      </p>
      <div className="flex gap-4">
        <Link href="/products" className="inline-flex items-center text-white bg-blue-600 font-bold hover:bg-blue-700 active:scale-95 transition-all px-8 py-4 rounded-xl shadow-sm hover:shadow-md">
          Shop Now <ArrowRight className="ml-2 w-5 h-5" />
        </Link>
        <Link href="/contact" className="inline-flex items-center text-blue-600 font-bold hover:text-blue-700 active:scale-95 transition-transform bg-white border border-gray-200 px-8 py-4 rounded-xl shadow-sm hover:shadow-md">
          Contact Us
        </Link>
      </div>
    </div>
  );
}
