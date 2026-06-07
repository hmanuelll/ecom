"use client";

import { useStore } from "@/store/useStore";
import Link from "next/link";
import { Trash2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, addToCart, showToast } = useStore();

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 tracking-tight">Your Wishlist</h1>

      {!wishlist || wishlist.length === 0 ? (
        <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800">
          <div className="w-24 h-24 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">❤️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto">Explore our collection and save your favorite items for later.</p>
          <Link href="/products" className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((product: any) => (
            <div key={product.id} className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-gray-100 dark:border-slate-800 flex flex-col hover:shadow-lg transition-all relative group">
              <button 
                onClick={() => removeFromWishlist(product.id)}
                className="absolute top-6 right-6 p-2 bg-white dark:bg-slate-800 rounded-full text-gray-400 hover:text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-all z-10"
              >
                <Trash2 size={18} />
              </button>
              
              <Link href={`/products/${product.id}`} className="aspect-square w-full rounded-xl bg-gray-50 dark:bg-slate-800 mb-4 overflow-hidden block">
                <img 
                  src={product.image || `https://via.placeholder.com/400x400.png?text=${encodeURIComponent(product.name)}`} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </Link>
              
              <div className="flex-1 flex flex-col">
                <Link href={`/products/${product.id}`} className="text-lg font-bold text-gray-900 dark:text-white hover:text-blue-600 transition-colors line-clamp-2">
                  {product.name}
                </Link>
                <p className="text-lg font-extrabold text-blue-600 dark:text-blue-400 mt-2 mb-4">
                  K{Number(product.price).toFixed(2)}
                </p>
                
                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-slate-800">
                  <Button 
                    className="w-full h-11 rounded-full bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 font-bold"
                    onClick={() => {
                      addToCart({
                        product_id: product.id,
                        name: product.name,
                        price: product.price,
                        quantity: 1,
                        image: product.image
                      });
                      showToast(`${product.name} added to cart!`);
                      removeFromWishlist(product.id);
                    }}
                  >
                    <ShoppingCart size={18} className="mr-2" />
                    Move to Cart
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
