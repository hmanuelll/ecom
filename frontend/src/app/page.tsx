"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Star, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, limit, query } from "firebase/firestore";

const categoryImages: Record<string, string> = {
  smartphones: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=400&auto=format&fit=crop",
  laptops: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=400&auto=format&fit=crop",
  gaming: "https://images.unsplash.com/photo-1605901309584-818e25960b8f?q=80&w=400&auto=format&fit=crop",
  audio: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=400&auto=format&fit=crop",
  wearables: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=400&auto=format&fit=crop",
};

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play hero carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === 2 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, "products"), limit(4));
        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(items);
      } catch (err) {
        console.error("Error fetching featured products from Firestore:", err);
      }
    };
    fetchProducts();
  }, []);

  const reviews = [
    { name: "Ngosa M.", date: "March 31, 2026", title: "I enjoyed the whole process", body: "I enjoyed the whole process, it was smooth and seamless. I received my order on time and the phone was perfect. I have no issues with it at all.", product: "Samsung Galaxy S22 5G 128GB", color: "Phantom Black", brand: "Galaxy" },
    { name: "Susan V.", date: "March 22, 2026", title: "Wow!! I'm so impressed", body: "Wow!! Im so impressed again... this is my 4 samsung phone that I bought from TechStore... they looked brand new and the shipping ... so fast... it has 1 year warranty.. ... job well done!", product: "Samsung Galaxy S24 Plus 5G 256GB", color: "Marble Gray", brand: "Galaxy" },
    { name: "Juan T.", date: "March 16, 2026", title: "Everything, the offers, shipment", body: "Everything, the offers, shipment, and quality of product.", product: "JBL Flip 6 - Portable Bluetooth Speaker", color: "Black", brand: "JBL" },
    { name: "Sherry J.", date: "March 9, 2026", title: "Apple Watch exactly as described", body: "I could not be happier with my purchase. It looked absolute brand new and works perfectly.", product: "Apple Watch Series 8", color: "Midnight", brand: "Apple" }
  ];

  return (
    <div className="bg-[#FAF9F6] dark:bg-slate-950 min-h-screen transition-colors duration-300">
      
      {/* Hero Carousel Section */}
      <div className="relative h-[550px] w-full overflow-hidden bg-gradient-to-r from-[#DFB35A] via-[#94C973] to-[#45B0A2]">
        {/* Carousel Content */}
        <div className="absolute inset-0 flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-2xl z-10 space-y-6 animate-in slide-in-from-left duration-700">
            <span className="inline-block bg-[#8A5EE6] text-white text-xs font-bold px-3 py-1 uppercase tracking-wider rounded-sm">
              Elevate Your Setup
            </span>
            <h1 className="text-5xl md:text-6xl font-black text-[#1A2521] leading-tight">
              High-End Electronics Without the High-End Price
            </h1>
            <p className="text-[#1A2521]/80 text-lg font-medium max-w-xl">
              Experience the pinnacle of innovation. From ultra-fast smartphones to powerhouse gaming rigs, we deliver top-tier, rigorously tested devices at unbeatable prices.
            </p>
            <Button className="bg-[#1C3A3B] hover:bg-[#142A2A] text-white px-8 py-6 rounded-full text-base font-bold transition-transform hover:scale-105 shadow-xl">
              Shop Now
            </Button>
          </div>

          <div className="hidden lg:block relative w-1/2 h-full">
            {/* Mock floating product images */}
            <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ${currentSlide === 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
              <img src="https://via.placeholder.com/500x500.png?text=Premium+Tech+Bundle" alt="Premium Tech" className="drop-shadow-2xl mix-blend-multiply" />
            </div>
            <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ${currentSlide === 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
              <img src="https://via.placeholder.com/500x500.png?text=Latest+Smartphones" alt="Smartphones" className="drop-shadow-2xl mix-blend-multiply" />
            </div>
            <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ${currentSlide === 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
              <img src="https://via.placeholder.com/500x500.png?text=Gaming+Laptops" alt="Laptops" className="drop-shadow-2xl mix-blend-multiply" />
            </div>
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
          {[0, 1, 2].map((idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 transition-all duration-300 rounded-full ${currentSlide === idx ? 'w-10 bg-[#FF8C00]' : 'w-8 bg-white/50 hover:bg-white/80'}`}
            />
          ))}
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F6F8F7] dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-8">What Our Customers Say</h2>
          
          <div className="flex overflow-x-auto gap-6 pb-8 snap-x hide-scrollbar" style={{ scrollbarWidth: 'none' }}>
            {reviews.map((review, idx) => (
              <div key={idx} className="min-w-[350px] w-[350px] bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 snap-center flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-1 text-sm text-gray-800 dark:text-gray-200 font-medium mb-1">
                        {review.name}
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span className="text-gray-500 font-normal">Verified Buyer</span>
                      </div>
                      <p className="text-xs text-gray-400">{review.date}</p>
                    </div>
                    <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-lg overflow-hidden shrink-0 border border-gray-100 dark:border-slate-600">
                      <img src={`https://via.placeholder.com/100x100.png?text=${encodeURIComponent(review.brand)}`} alt="Product" className="w-full h-full object-cover" />
                    </div>
                  </div>

                  <h3 className="font-extrabold text-gray-900 dark:text-white mb-2">{review.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-4 leading-relaxed">{review.body}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-50 dark:border-slate-700">
                  <p className="text-xs text-gray-500 truncate mb-1">Reviewing {review.product}</p>
                  <Link href={`/products`} className="text-sm font-bold text-[#C77C38] hover:underline">
                    Shop {review.brand}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Products Grid */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Featured Devices</h2>
          <Link href="/products" className="text-blue-600 font-bold hover:underline flex items-center">
            View All <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`} className="group flex flex-col justify-start bg-white dark:bg-slate-800 rounded-2xl p-4 transition-all hover:shadow-xl hover:-translate-y-1 border border-gray-100 dark:border-slate-700 cursor-pointer">
              <div className="aspect-square w-full overflow-hidden rounded-xl bg-gray-50 dark:bg-slate-700 mb-4 relative">
                <img
                  src={product.category?.slug && categoryImages[product.category.slug] ? categoryImages[product.category.slug] : `https://via.placeholder.com/400x400.png?text=${encodeURIComponent(product.name)}`}
                  alt={product.name}
                  className="h-full w-full object-cover object-center group-hover:opacity-75 transition-opacity"
                />
                <div className="absolute top-2 left-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-gray-800 dark:text-gray-200 shadow-sm">
                  Certified Pre-Owned
                </div>
              </div>
              <div className="flex flex-col items-center mt-4 text-center">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {product.name}
                </h3>
                <p className="text-lg font-extrabold text-gray-900 dark:text-white mt-1">K{Number(product.price).toFixed(2)}</p>

                {product.category?.slug === 'laptops' && product.attributes && (
                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-left w-full border-t border-gray-100 dark:border-slate-700 pt-4">
                    <div className="flex flex-col"><span className="text-gray-400">CPU</span><span className="font-semibold text-gray-800 dark:text-gray-200 line-clamp-1">{product.attributes.cpu}</span></div>
                    <div className="flex flex-col"><span className="text-gray-400">RAM</span><span className="font-semibold text-gray-800 dark:text-gray-200 line-clamp-1">{product.attributes.ram}</span></div>
                    <div className="flex flex-col"><span className="text-gray-400">Storage</span><span className="font-semibold text-gray-800 dark:text-gray-200 line-clamp-1">{product.attributes.storage}</span></div>
                    <div className="flex flex-col"><span className="text-gray-400">GPU</span><span className="font-semibold text-gray-800 dark:text-gray-200 line-clamp-1">{product.attributes.gpu}</span></div>
                    {product.attributes.screen && <div className="flex flex-col"><span className="text-gray-400">Screen</span><span className="font-semibold text-gray-800 dark:text-gray-200 line-clamp-1">{product.attributes.screen}</span></div>}
                    {product.attributes.battery && <div className="flex flex-col"><span className="text-gray-400">Battery</span><span className="font-semibold text-gray-800 dark:text-gray-200 line-clamp-1">{product.attributes.battery}</span></div>}
                  </div>
                )}

                {product.category?.slug === 'smartphones' && product.attributes && (
                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-left w-full border-t border-gray-100 dark:border-slate-700 pt-4">
                    <div className="flex flex-col"><span className="text-gray-400">OS</span><span className="font-semibold text-gray-800 dark:text-gray-200 line-clamp-1">{product.attributes.os}</span></div>
                    <div className="flex flex-col"><span className="text-gray-400">Storage</span><span className="font-semibold text-gray-800 dark:text-gray-200 line-clamp-1">{product.attributes.storage}</span></div>
                    <div className="flex flex-col"><span className="text-gray-400">RAM</span><span className="font-semibold text-gray-800 dark:text-gray-200 line-clamp-1">{product.attributes.ram}</span></div>
                    <div className="flex flex-col"><span className="text-gray-400">Screen</span><span className="font-semibold text-gray-800 dark:text-gray-200 line-clamp-1">{product.attributes.screen}</span></div>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Trust Badges */}
      <div className="bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 py-16 transition-colors duration-300">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-slate-800">
            <div className="p-4 flex flex-col items-center">
              <ShieldCheck className="w-12 h-12 text-blue-500 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">12-Month Warranty</h3>
              <p className="text-gray-500 text-sm max-w-xs mx-auto">Every device is thoroughly tested and backed by our comprehensive warranty.</p>
            </div>
            <div className="p-4 flex flex-col items-center pt-8 md:pt-4">
              <CheckCircle2 className="w-12 h-12 text-green-500 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">90+ Point Inspection</h3>
              <p className="text-gray-500 text-sm max-w-xs mx-auto">Our certified technicians ensure every component works perfectly.</p>
            </div>
            <div className="p-4 flex flex-col items-center pt-8 md:pt-4">
              <Star className="w-12 h-12 text-yellow-500 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Satisfaction Guaranteed</h3>
              <p className="text-gray-500 text-sm max-w-xs mx-auto">Not happy? Return it within 30 days for a full refund, no questions asked.</p>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
