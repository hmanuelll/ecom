"use client";

import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Trash2 } from "lucide-react";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useStore();
  
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="bg-[#FAF9F6] dark:bg-slate-950 min-h-screen transition-colors duration-300 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-extrabold mb-4 text-gray-900 dark:text-white">Your cart is empty</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 text-lg">Looks like you haven't added anything to your cart yet.</p>
          <Link href="/products">
            <Button className="h-12 px-8 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-blue-500/25 transition-all">Start Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9F6] dark:bg-slate-950 min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-10">Shopping Cart</h1>
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
          <div className="lg:col-span-7">
            <ul className="border-t border-b border-gray-200 dark:border-slate-800 divide-y divide-gray-200 dark:divide-slate-800">
              {cart.map((item) => (
                <li key={item.product_id} className="flex py-6 sm:py-10">
                  <div className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 dark:bg-slate-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-700">
                    <img 
                      src={item.image || `https://via.placeholder.com/400x400.png?text=${encodeURIComponent(item.name)}`} 
                      alt={item.name} 
                      className="w-full h-full object-center object-cover"
                    />
                  </div>
                  <div className="ml-6 flex-1 flex flex-col justify-center">
                    <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                      <div>
                        <div className="flex justify-between">
                          <h3 className="text-lg font-bold">
                            <Link href={`/products/${item.product_id}`} className="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                              {item.name}
                            </Link>
                          </h3>
                        </div>
                        <p className="mt-2 text-xl font-extrabold text-gray-900 dark:text-gray-100">K{item.price.toFixed(2)}</p>
                      </div>

                      <div className="mt-4 sm:mt-0 sm:pr-9 flex items-center">
                        <select
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.product_id, Number(e.target.value))}
                          className="max-w-full rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2 px-4 text-base leading-5 font-bold text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-colors cursor-pointer"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((q) => (
                            <option key={q} value={q}>{q}</option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.product_id)}
                          className="ml-6 text-sm font-bold text-red-500 hover:text-red-600 dark:hover:text-red-400 flex items-center transition-colors p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg"
                        >
                          <Trash2 className="w-5 h-5 mr-1.5"/> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-16 bg-white dark:bg-slate-900 rounded-2xl px-4 py-6 sm:p-6 lg:p-8 lg:mt-0 lg:col-span-5 border border-gray-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">Order summary</h2>
            <dl className="mt-6 space-y-4">
              <div className="flex items-center justify-between border-t border-gray-200 dark:border-slate-800 pt-6">
                <dt className="text-lg font-medium text-gray-900 dark:text-gray-300">Order total</dt>
                <dd className="text-2xl font-extrabold text-gray-900 dark:text-white">K{total.toFixed(2)}</dd>
              </div>
            </dl>
            <div className="mt-8">
              <Link href="/checkout">
                <Button className="w-full h-14 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/25 transition-all rounded-xl">Secure Checkout</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
