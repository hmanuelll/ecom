"use client";

import Link from "next/link";
import { ArrowRight, Globe } from "lucide-react";

export default function LanguageSettingsPage() {
  return (
    <div className="min-h-[70vh] bg-[#FAF9F6] py-20 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="w-24 h-24 bg-teal-50 rounded-full flex items-center justify-center mb-6">
        <Globe className="w-12 h-12 text-teal-500" />
      </div>
      <h1 className="text-4xl font-extrabold text-gray-900 mb-4 text-center">Language & Region</h1>
      <p className="text-gray-500 mb-8 text-center max-w-2xl leading-relaxed">
        TechStore is currently available in English, but we're expanding! Soon you'll be able to select from multiple languages and regional currencies.
      </p>
      <div className="flex gap-4">
        <Link href="/" className="inline-flex items-center text-white bg-teal-600 font-bold hover:bg-teal-700 active:scale-95 transition-all px-8 py-4 rounded-xl shadow-sm hover:shadow-md">
          Save Preferences
        </Link>
        <Link href="/account" className="inline-flex items-center text-teal-600 font-bold hover:text-teal-700 active:scale-95 transition-transform bg-white border border-gray-200 px-8 py-4 rounded-xl shadow-sm hover:shadow-md">
          Back to Account <ArrowRight className="ml-2 w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
