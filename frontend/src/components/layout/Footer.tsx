"use client";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#1A2521] text-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-32">
          
          {/* Left: About TechStore */}
          <div className="space-y-6 max-w-lg">
            <Link href="/" className="text-3xl font-extrabold text-white tracking-tight italic flex items-center">
              <span className="text-2xl mr-2">🍍</span>
              TechStore
            </Link>
            
            <h3 className="font-bold text-lg">About TechStore</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              We are a consumer electronics provider that connects people to reliable,
              Certified Pre-Owned Devices. We make it affordable and easy for you to
              get the most out of your personal technology purchases.
            </p>
            <p className="text-sm text-gray-300 leading-relaxed">
              TechStore is certified to R2v3, the most widely adopted global standard and
              certification program in the industry for the Responsible Recycling of electronics.
            </p>
            <p className="text-sm text-gray-300 leading-relaxed">
              TechStore is not affiliated with, authorized, sponsored, or otherwise approved
              by the manufacturers of the products available for purchase. All
              trademarks, logos, brand names, and product names are the property of
              their respective owners and are used for identification purposes only.
            </p>
            
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-4">
              <a href="#" className="w-10 h-10 bg-[#253D35] flex items-center justify-center hover:bg-[#2A453C] transition-colors rounded">
                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 bg-[#253D35] flex items-center justify-center hover:bg-[#2A453C] transition-colors rounded">
                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
            </div>
          </div>

          {/* Right: Quick Links */}
          <div>
            <h3 className="font-bold text-[#94C973] text-lg mb-6">Quick Links</h3>
            <div className="space-y-6">
              <Link href="/products?category=apple" className="block font-bold hover:text-[#94C973] transition-colors">Apple</Link>
              <Link href="/products?category=iphones" className="block font-bold hover:text-[#94C973] transition-colors">iPhones</Link>
              <Link href="/products?category=androids" className="block font-bold hover:text-[#94C973] transition-colors">Androids</Link>
              <Link href="/products?category=headphones" className="block font-bold hover:text-[#94C973] transition-colors">Headphones</Link>
              <Link href="/policies" className="block font-bold hover:text-[#94C973] transition-colors">Policies</Link>
              <Link href="/about" className="block font-bold hover:text-[#94C973] transition-colors">About Us</Link>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
