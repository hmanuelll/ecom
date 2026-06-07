"use client";

import Link from "next/link";
import { ArrowRight, HelpCircle } from "lucide-react";

export default function HelpPage() {
  return (
    <div className="min-h-[70vh] bg-[#FAF9F6] py-20 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center mb-6">
        <HelpCircle className="w-12 h-12 text-purple-500" />
      </div>
      <h1 className="text-4xl font-extrabold text-gray-900 mb-4 text-center">Help & Support</h1>
      <p className="text-gray-500 mb-8 text-center max-w-2xl leading-relaxed">
        Need assistance with your order or have questions about a product? Our customer service team is here 24/7 to help you.
      </p>
      <div className="flex gap-4">
        <Link href="/contact" className="inline-flex items-center text-white bg-purple-600 font-bold hover:bg-purple-700 active:scale-95 transition-all px-8 py-4 rounded-xl shadow-sm hover:shadow-md">
          Contact Support
        </Link>
        <Link href="/account/orders" className="inline-flex items-center text-purple-600 font-bold hover:text-purple-700 active:scale-95 transition-transform bg-white border border-gray-200 px-8 py-4 rounded-xl shadow-sm hover:shadow-md">
          Track My Order <ArrowRight className="ml-2 w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
