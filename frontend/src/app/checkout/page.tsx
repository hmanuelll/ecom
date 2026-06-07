"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CheckoutPage() {
  const { cart, user, clearCart } = useStore();
  const router = useRouter();
  const [address, setAddress] = useState({
    full_name: "",
    phone_number: "",
    email_address: "",
    province: "",
    town: "",
    delivery_address: "",
    landmark: ""
  });
  const [deliveryMethod, setDeliveryMethod] = useState("Home Delivery");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (cart.length === 0) {
      router.push("/cart");
    } else if (!user) {
      router.push("/login");
    }
  }, [cart.length, user, router]);

  if (cart.length === 0 || !user) {
    return null;
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const orderItems = cart.map(item => ({
        product: { name: item.name },
        product_id: item.product_id,
        quantity: item.quantity,
        total_price: item.price * item.quantity
      }));
      
      const newOrder = {
        user_id: user.id,
        address,
        delivery_method: deliveryMethod,
        items: orderItems,
        total_amount: total,
        status: "Awaiting Payment",
        created_at: new Date().toISOString(),
        payment_type: "",
        transaction_id: ""
      };
      
      await addDoc(collection(db, "orders"), newOrder);
      clearCart();
      router.push("/account/orders");
    } catch (err: any) {
      setError(err.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="bg-[#FAF9F6] dark:bg-slate-950 min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-10">Checkout</h1>
        <form onSubmit={handlePlaceOrder} className="lg:grid lg:grid-cols-12 lg:gap-x-12 xl:gap-x-16 lg:items-start">
          <div className="lg:col-span-7">
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-6">Delivery Details</h2>
            {error && <div className="text-red-600 bg-red-50 dark:bg-red-500/10 p-4 rounded-xl mb-6 text-sm font-medium">{error}</div>}
            
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm space-y-8">
              
              {/* Delivery Method Selection */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Delivery Method</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button type="button" onClick={() => setDeliveryMethod("Home Delivery")} className={`p-4 rounded-xl border-2 flex items-center justify-center gap-3 transition-all ${deliveryMethod === 'Home Delivery' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-bold' : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-400 font-medium hover:border-blue-300 dark:hover:border-blue-700'}`}>
                    Home Delivery
                  </button>
                  <button type="button" onClick={() => setDeliveryMethod("Store Pickup")} className={`p-4 rounded-xl border-2 flex items-center justify-center gap-3 transition-all ${deliveryMethod === 'Store Pickup' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-bold' : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-400 font-medium hover:border-blue-300 dark:hover:border-blue-700'}`}>
                    Store Pickup
                  </button>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-slate-800">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input 
                    required placeholder="Full Name" 
                    value={address.full_name} 
                    onChange={e => setAddress({...address, full_name: e.target.value})} 
                    className="h-12 bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white focus:ring-blue-500 rounded-xl"
                  />
                  <Input 
                    required placeholder="Phone Number" 
                    value={address.phone_number} 
                    onChange={e => setAddress({...address, phone_number: e.target.value})} 
                    className="h-12 bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white focus:ring-blue-500 rounded-xl"
                  />
                </div>
                <Input 
                  placeholder="Email Address (Optional)" 
                  type="email"
                  value={address.email_address} 
                  onChange={e => setAddress({...address, email_address: e.target.value})} 
                  className="h-12 bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white focus:ring-blue-500 rounded-xl"
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input 
                    required placeholder="Province" 
                    value={address.province} 
                    onChange={e => setAddress({...address, province: e.target.value})} 
                    className="h-12 bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white focus:ring-blue-500 rounded-xl"
                  />
                  <Input 
                    required placeholder="Town / City" 
                    value={address.town} 
                    onChange={e => setAddress({...address, town: e.target.value})} 
                    className="h-12 bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white focus:ring-blue-500 rounded-xl"
                  />
                </div>
                <Input 
                  required={deliveryMethod === 'Home Delivery'} placeholder="Delivery Address" 
                  value={address.delivery_address} 
                  onChange={e => setAddress({...address, delivery_address: e.target.value})} 
                  className="h-12 bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white focus:ring-blue-500 rounded-xl"
                />
                <Input 
                  placeholder="Nearest Landmark (Optional)" 
                  value={address.landmark} 
                  onChange={e => setAddress({...address, landmark: e.target.value})} 
                  className="h-12 bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white focus:ring-blue-500 rounded-xl"
                />
              </div>
            </div>
          </div>

          <div className="mt-16 bg-white dark:bg-slate-900 rounded-2xl px-4 py-6 sm:p-6 lg:p-8 lg:mt-0 lg:col-span-5 border border-gray-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-6">Order Summary</h2>
            <ul className="divide-y divide-gray-200 dark:divide-slate-800">
              {cart.map((item) => (
                <li key={item.product_id} className="flex py-6">
                  <div className="w-16 h-16 flex-shrink-0 bg-gray-100 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden mr-4">
                    <img 
                      src={`https://via.placeholder.com/100x100.png?text=${encodeURIComponent(item.name)}`}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="flex justify-between text-base font-bold text-gray-900 dark:text-white">
                      <h3 className="line-clamp-2 pr-4">{item.name}</h3>
                      <p className="font-extrabold whitespace-nowrap">K{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">Qty: {item.quantity}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-gray-200 dark:border-slate-800 pt-6 mt-6">
              <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                <p>Subtotal</p>
                <p>K{total.toFixed(2)}</p>
              </div>
              <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-400 mb-6">
                <p>Estimated Delivery Fee</p>
                <p>Calculated later</p>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white mb-8 border-t border-gray-100 dark:border-slate-800 pt-4">
                <p>Total</p>
                <p className="text-2xl font-extrabold">K{total.toFixed(2)}</p>
              </div>
              
              <Button type="submit" className="w-full h-14 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/25 transition-all rounded-xl" disabled={loading}>
                {loading ? "Processing..." : "Submit Order Request"}
              </Button>
              <div className="mt-4 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-700/50">
                <p className="text-sm text-center font-medium text-gray-600 dark:text-gray-300">
                  After placing your order, it will be reviewed by our team. Once confirmed, you will be notified to proceed with payment via Mobile Money, Pay on Delivery, or Store Pickup.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
