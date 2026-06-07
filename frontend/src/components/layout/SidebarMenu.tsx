"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Menu, X, User as UserIcon, Monitor, Smartphone, Gamepad2, Headphones, Home, Tag, Sparkles, Phone, HelpCircle, MapPin, Heart, Settings, Globe, LogOut } from "lucide-react";
import { useStore } from "@/store/useStore";
import Link from "next/link";
import { api } from "@/lib/api";
import { FeedbackModal } from "@/components/ui/FeedbackModal";

export function SidebarMenu({ onLogoutClick }: { onLogoutClick: () => void }) {
  const [open, setOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const { user } = useStore();

  const CategoryItem = ({ icon: Icon, label, href }: any) => (
    <Link href={href} onClick={() => setOpen(false)} className="flex items-center py-3 px-4 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors">
      <Icon className="w-5 h-5 mr-3 text-gray-400" />
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );

  return (
    <>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
        <button className="p-2 -ml-2 text-gray-600 hover:text-blue-600 transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          <Menu className="w-6 h-6" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity" />
        <Dialog.Content className="fixed inset-y-0 left-0 w-80 bg-white shadow-2xl z-50 focus:outline-none flex flex-col animate-in slide-in-from-left duration-300">
          <Dialog.Title className="sr-only">Navigation Menu</Dialog.Title>
          <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-blue-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
                <UserIcon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-900">Hello, {user ? user.name.split(' ')[0] : 'Guest'}</h2>
                {!user && <Link href="/login" onClick={() => setOpen(false)} className="text-xs text-blue-600 font-medium hover:underline">Sign in to your account</Link>}
              </div>
            </div>
            <Dialog.Close asChild>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="py-2">
              <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Shop by Category</div>
              <CategoryItem icon={Sparkles} label="Featured Products" href="/products" />
              <CategoryItem icon={Monitor} label="Computers & Laptops" href="/products?category=computers" />
              <CategoryItem icon={Smartphone} label="Smartphones & Tablets" href="/products?category=smartphones" />
              <CategoryItem icon={Gamepad2} label="Gaming & Entertainment" href="/products?category=gaming" />
              <CategoryItem icon={Headphones} label="Accessories" href="/products?category=accessories" />
              <CategoryItem icon={Home} label="Home & Office Electronics" href="/products?category=home-office" />
            </div>

            <div className="h-px bg-gray-100 my-2 mx-4" />

            <div className="py-2">
              <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Programs & Offers</div>
              <CategoryItem icon={Tag} label="Deals & Promotions" href="/products" />
              <CategoryItem icon={Sparkles} label="New Arrivals" href="/products" />
            </div>

            <div className="h-px bg-gray-100 my-2 mx-4" />

            <div className="py-2">
              <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Help & Settings</div>
              <CategoryItem icon={MapPin} label="Order Tracking" href="/account/orders" />
              <CategoryItem icon={Heart} label="Wishlist" href="/wishlist" />
              <CategoryItem icon={Settings} label="Account Settings" href="/account" />
              <CategoryItem icon={HelpCircle} label="Customer Services" href="/help" />
              <CategoryItem icon={Phone} label="Contact Us" href="/contact" />
              <CategoryItem icon={Globe} label="Language Preferences" href="/settings/language" />
              <button 
                onClick={() => setFeedbackOpen(true)} 
                className="flex items-center py-3 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors w-full text-left"
              >
                <HelpCircle className="w-5 h-5 mr-3 text-gray-400" />
                <span className="text-sm font-medium">Send Feedback</span>
              </button>
            </div>
          </div>

          {user && (
            <div className="p-4 border-t border-gray-100">
              <button 
                onClick={() => { setOpen(false); onLogoutClick(); }} 
                className="flex items-center w-full py-2 px-4 text-red-600 hover:bg-red-50 transition-colors rounded-md font-medium"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Sign Out
              </button>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
      <FeedbackModal open={feedbackOpen} onOpenChange={setFeedbackOpen} />
    </>
  );
}
