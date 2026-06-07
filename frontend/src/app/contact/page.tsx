"use client";

import Link from "next/link";
import { ArrowRight, PhoneCall } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-[70vh] bg-[#FAF9F6] py-20 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-6">
        <PhoneCall className="w-12 h-12 text-orange-500" />
      </div>
      <h1 className="text-4xl font-extrabold text-gray-900 mb-4 text-center">Contact Us</h1>
      <p className="text-gray-500 mb-8 text-center max-w-2xl leading-relaxed">
        Our dedicated support team is available via Phone, Email, or Live Chat from Monday to Friday, 9:00 AM - 6:00 PM EST.
      </p>
      <div className="flex gap-4">
        <button className="inline-flex items-center text-white bg-orange-600 font-bold hover:bg-orange-700 active:scale-95 transition-all px-8 py-4 rounded-xl shadow-sm hover:shadow-md">
          Open Live Chat
        </button>
        <Link href="/help" className="inline-flex items-center text-orange-600 font-bold hover:text-orange-700 active:scale-95 transition-transform bg-white border border-gray-200 px-8 py-4 rounded-xl shadow-sm hover:shadow-md">
          Browse FAQs <ArrowRight className="ml-2 w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
