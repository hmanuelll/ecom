"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Zap, Bookmark, ShieldCheck, Truck, ArrowLeft } from "lucide-react";
import Link from "next/link";

const categoryImages: Record<string, string> = {
  smartphones: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=400&auto=format&fit=crop",
  laptops: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=400&auto=format&fit=crop",
  gaming: "https://images.unsplash.com/photo-1605901309584-818e25960b8f?q=80&w=400&auto=format&fit=crop",
  audio: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=400&auto=format&fit=crop",
  wearables: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=400&auto=format&fit=crop",
};

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [similarItems, setSimilarItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart, addToWishlist, showToast, user } = useStore();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const productRef = doc(db, "products", id as string);
        const productSnap = await getDoc(productRef);
        
        if (productSnap.exists()) {
          const data = { id: productSnap.id, ...productSnap.data() } as any;
          setProduct(data);
          
          // Fetch similar products
          if (data.category?.slug) {
            const querySnapshot = await getDocs(collection(db, "products"));
            const items = querySnapshot.docs
              .map(doc => ({ id: doc.id, ...doc.data() }))
              .filter((p: any) => p.category?.slug === data.category.slug && p.id !== data.id)
              .slice(0, 4);
            setSimilarItems(items);
          }
        }
      } catch (err) {
        console.error("Error fetching product details from Firestore:", err);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) fetchProductDetails();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading product details...</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center text-red-500">Product not found</div>;

  // Generate 4 mock image placeholders
  const baseImg = product.category?.slug && categoryImages[product.category.slug] 
    ? categoryImages[product.category.slug] 
    : `https://via.placeholder.com/600x600.png?text=${encodeURIComponent(product.name)}`;
    
  const images = [
    baseImg,
    `https://via.placeholder.com/600x600.png?text=${encodeURIComponent(product.name)}+2`,
    `https://via.placeholder.com/600x600.png?text=${encodeURIComponent(product.name)}+3`,
    `https://via.placeholder.com/600x600.png?text=${encodeURIComponent(product.name)}+4`,
  ];

  const handleAddToCart = () => {
    addToCart({ product_id: product.id, name: product.name, price: Number(product.price), quantity: 1, image: baseImg });
    showToast(`${product.name} added to cart`);
  };

  const handleBuyNow = () => {
    if (!user) {
      router.push("/login");
      return;
    }
    addToCart({ product_id: product.id, name: product.name, price: Number(product.price), quantity: 1, image: baseImg });
    router.push("/checkout");
  };

  return (
    <div className="bg-[#FAF9F6] dark:bg-slate-950 min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Shopping
        </Link>

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
          {/* Image Gallery */}
          <div className="flex flex-col-reverse">
            <div className="hidden mt-6 w-full max-w-2xl mx-auto sm:block lg:max-w-none">
              <div className="grid grid-cols-4 gap-4" aria-orientation="horizontal" role="tablist">
                {images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative h-24 bg-gray-100 rounded-md flex items-center justify-center text-sm font-medium uppercase text-gray-900 cursor-pointer hover:bg-gray-50 overflow-hidden ring-2 focus:outline-none ${selectedImage === idx ? 'ring-blue-500' : 'ring-transparent'}`}
                  >
                    <span className="sr-only">Image {idx + 1}</span>
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-center object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <img src={images[selectedImage]} alt={product.name} className="w-full h-full object-center object-cover" />
            </div>
          </div>

          {/* Product Info */}
          <div className="mt-10 px-4 sm:px-0 lg:mt-0">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">{product.name}</h1>
            
            <div className="mt-3 flex items-center">
              <p className="text-3xl text-gray-900 dark:text-gray-100 font-bold">K{Number(product.price).toFixed(2)}</p>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>
              <div className="text-base text-gray-700 dark:text-gray-200 space-y-6">
                <p>{product.description}</p>
                <p>Equipped with industry-leading features, this premium device offers unparalleled performance. Designed for professionals and enthusiasts alike, it delivers reliability when you need it most.</p>
              </div>
            </div>

            {/* Item Specifics */}
            {product.attributes && Object.keys(product.attributes).length > 0 && (
              <div className="mt-10 border-t border-gray-100 dark:border-slate-800 pt-8">
                <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-6">Item specifics</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                  {Object.entries(product.attributes).map(([key, value]) => (
                    <div key={key} className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-50 dark:border-slate-800/50">
                      <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">{key.replace(/_/g, ' ')}</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white sm:text-right mt-1 sm:mt-0">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 border-t border-gray-100 dark:border-slate-800 pt-8">
              <div className="flex items-center mb-4">
                <div className={`w-3 h-3 rounded-full mr-2 ${product.stock_quantity > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : 'Out of stock'}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <Button 
                  onClick={handleAddToCart}
                  disabled={product.stock_quantity === 0 || !user}
                  className="flex-1 bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50 h-14 text-lg font-bold shadow-sm"
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                <Button 
                  onClick={handleBuyNow}
                  disabled={product.stock_quantity === 0 || !user}
                  className="flex-1 bg-blue-600 text-white hover:bg-blue-700 h-14 text-lg font-bold shadow-md"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Buy Now
                </Button>
                <Button 
                variant="outline" 
                className="w-14 h-14 rounded-full border-2 border-gray-200 dark:border-slate-800 text-gray-700 dark:text-gray-300 hover:text-red-500 hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all shrink-0 active:scale-95"
                onClick={() => {
                  addToWishlist({ ...product, image: baseImg });
                  showToast("Added to wishlist", "success");
                }}
              >
                  <Bookmark className="w-5 h-5" />
                </Button>
              </div>
              {!user && <p className="mt-3 text-sm text-center text-gray-500">Please log in to purchase items.</p>}
            </div>

          </div>
        </div>

        {/* Similar Items Section */}
        {similarItems.length > 0 && (
          <div className="mt-24 border-t border-gray-200 dark:border-slate-800 pt-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Similar items</h2>
              <Link href={`/products?category=${product.category.slug}`} className="text-sm font-bold text-blue-600 hover:text-blue-500 hover:underline">See all</Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {similarItems.map((item) => (
                <Link key={item.id} href={`/products/${item.id}`} className="group flex flex-col justify-start bg-white dark:bg-slate-800 rounded-2xl p-4 transition-all hover:shadow-xl hover:-translate-y-1 border border-gray-100 dark:border-slate-700 cursor-pointer">
                  <div className="aspect-square w-full overflow-hidden rounded-xl bg-gray-50 dark:bg-slate-700 mb-4 relative">
                    <img
                      src={item.category?.slug && categoryImages[item.category.slug] ? categoryImages[item.category.slug] : `https://via.placeholder.com/400x400.png?text=${encodeURIComponent(item.name)}`}
                      alt={item.name}
                      className="h-full w-full object-cover object-center group-hover:opacity-75 transition-opacity"
                    />
                  </div>
                  <div className="flex flex-col items-center mt-4 text-center">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-lg font-extrabold text-gray-900 dark:text-white mt-1">K{Number(item.price).toFixed(2)}</p>

                    {item.category?.slug === 'laptops' && item.attributes && (
                      <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-left w-full border-t border-gray-100 dark:border-slate-700 pt-4">
                        <div className="flex flex-col"><span className="text-gray-400">CPU</span><span className="font-semibold text-gray-800 dark:text-gray-200 line-clamp-1">{item.attributes.cpu}</span></div>
                        <div className="flex flex-col"><span className="text-gray-400">RAM</span><span className="font-semibold text-gray-800 dark:text-gray-200 line-clamp-1">{item.attributes.ram}</span></div>
                        <div className="flex flex-col"><span className="text-gray-400">Storage</span><span className="font-semibold text-gray-800 dark:text-gray-200 line-clamp-1">{item.attributes.storage}</span></div>
                        <div className="flex flex-col"><span className="text-gray-400">GPU</span><span className="font-semibold text-gray-800 dark:text-gray-200 line-clamp-1">{item.attributes.gpu}</span></div>
                        {item.attributes.screen && <div className="flex flex-col"><span className="text-gray-400">Screen</span><span className="font-semibold text-gray-800 dark:text-gray-200 line-clamp-1">{item.attributes.screen}</span></div>}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
