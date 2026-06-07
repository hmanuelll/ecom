"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ShoppingBag, X, Plus, Minus, AlertCircle, ShieldCheck } from "lucide-react";
import { useStore } from "@/store/useStore";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CartPanel() {
  const [open, setOpen] = useState(false);
  const { cart, removeFromCart, updateQuantity, showToast } = useStore();

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="relative cursor-pointer text-gray-900 dark:text-gray-200 hover:text-blue-600 transition-colors focus:outline-none flex items-center">
          <ShoppingBag className="w-6 h-6" strokeWidth={2} />
          {cartItemsCount > 0 && (
            <span className="absolute -top-1 -right-2 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold leading-none text-white bg-blue-600 rounded-full">
              {cartItemsCount}
            </span>
          )}
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity" />
        <Dialog.Content className="fixed inset-y-0 right-0 w-full sm:w-[400px] bg-white dark:bg-slate-900 shadow-2xl z-50 focus:outline-none flex flex-col animate-in slide-in-from-right duration-300">
          <Dialog.Title className="sr-only">Shopping Cart</Dialog.Title>
          <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/50">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              Your Cart 
              <span className="bg-blue-100 text-blue-700 text-xs py-1 px-2 rounded-full">{cartItemsCount} items</span>
            </h2>
            <Dialog.Close asChild>
              <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-200 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
                <div className="w-20 h-20 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-10 h-10 text-gray-300 dark:text-gray-600" />
                </div>
                <p className="text-lg font-medium text-gray-900 dark:text-white">Your cart is empty</p>
                <Dialog.Close asChild>
                  <Button variant="outline" className="mt-4">Continue Shopping</Button>
                </Dialog.Close>
              </div>
            ) : (
              <div className="space-y-6">
                {cart.map((item) => (
                  <div key={item.product_id} className="flex gap-4 group">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center border border-gray-200 overflow-hidden">
                       <img src={item.image || `https://via.placeholder.com/200x200.png?text=${encodeURIComponent(item.name)}`} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start">
                        <Link href={`/products/${item.product_id}`} onClick={() => setOpen(false)} className="text-sm font-semibold text-gray-900 hover:text-blue-600 line-clamp-2">
                          {item.name}
                        </Link>
                        <p className="text-gray-900 dark:text-white font-medium">K{Number(item.price).toFixed(2)}</p>
                      </div>
                      <div className="mt-1 flex items-center text-xs text-green-600 font-medium">
                         <ShieldCheck className="w-3 h-3 mr-1" /> In Stock
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="flex items-center border border-gray-200 rounded-md bg-white">
                          <button 
                            onClick={() => item.quantity > 1 ? updateQuantity(item.product_id, item.quantity - 1) : removeFromCart(item.product_id)}
                            className="p-1 hover:bg-gray-100 text-gray-600 rounded-l-md transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                            className="p-1 hover:bg-gray-100 text-gray-600 rounded-r-md transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button onClick={() => {
                          removeFromCart(item.product_id);
                          showToast("Removed from cart", "info");
                        }} className="text-xs text-red-500 hover:text-red-700 hover:underline cursor-pointer">
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="border-t border-gray-100 dark:border-slate-800 p-5 bg-white dark:bg-slate-900 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
              <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg flex items-start gap-3 mb-4">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <p className="text-xs text-blue-800">You are eligible for free standard shipping on this order!</p>
              </div>
              <div className="flex justify-between text-base font-medium text-gray-900 dark:text-white mb-4">
                <p>Subtotal</p>
                <p className="text-xl font-bold">K{subtotal.toFixed(2)}</p>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Shipping and taxes calculated at checkout.</p>
              <div className="space-y-3">
                <Dialog.Close asChild>
                  <Link href="/cart" className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                    Go to Cart
                  </Link>
                </Dialog.Close>
                <Dialog.Close asChild>
                  <Link href="/checkout" className="w-full flex justify-center items-center px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                    Proceed to Checkout
                  </Link>
                </Dialog.Close>
              </div>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
