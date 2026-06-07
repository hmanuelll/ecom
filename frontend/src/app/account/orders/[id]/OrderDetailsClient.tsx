"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ArrowLeft, CheckCircle2, AlertCircle, Upload, Wallet, Truck, Store } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Payment State
  const [paymentType, setPaymentType] = useState("Mobile Money");
  const [transactionId, setTransactionId] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const orderRef = doc(db, "orders", id as string);
      const orderSnap = await getDoc(orderRef);
      if (orderSnap.exists()) {
        setOrder({ id: orderSnap.id, ...orderSnap.data() });
      } else {
        router.push("/account/orders");
      }
    } catch (e) {
      console.error(e);
      router.push("/account/orders");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      if (paymentType === "Mobile Money" && !transactionId) {
        throw new Error("Please provide a Transaction ID.");
      }

      const orderRef = doc(db, "orders", id as string);
      await updateDoc(orderRef, {
        status: "Processing",
        payment_type: paymentType,
        transaction_id: transactionId || "N/A",
      });
      
      setPaymentSuccess(true);
      fetchOrder();
    } catch (err: any) {
      setError(err.message || "Payment submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading order details..." />;
  if (!order) return null;

  return (
    <div className="min-h-screen bg-[#FAF9F6] dark:bg-slate-950 transition-colors duration-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/account/orders" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-blue-600 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Orders
        </Link>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Order #{order.id.toString().padStart(6, '0')}</h1>
          <span className="px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 self-start sm:self-auto">
            {order.status}
          </span>
        </div>

        {/* Payment Gateway Section */}
        {order.status === 'Awaiting Payment' && !paymentSuccess && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-blue-200 dark:border-blue-900/50 p-6 sm:p-8 mb-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">Complete Your Payment</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Your order has been confirmed. Please select a payment method to complete your purchase.</p>

            {error && <div className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 p-4 rounded-xl mb-6 text-sm font-medium flex items-center"><AlertCircle className="w-5 h-5 mr-2"/>{error}</div>}

            <form onSubmit={handlePaymentSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <button type="button" onClick={() => setPaymentType("Mobile Money")} className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${paymentType === 'Mobile Money' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : 'border-gray-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 text-gray-600 dark:text-gray-400'}`}>
                  <Wallet className="w-6 h-6" /> <span className="font-bold">Mobile Money</span>
                </button>
                <button type="button" onClick={() => setPaymentType("Pay on Delivery")} className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${paymentType === 'Pay on Delivery' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : 'border-gray-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 text-gray-600 dark:text-gray-400'}`}>
                  <Truck className="w-6 h-6" /> <span className="font-bold">Pay on Delivery</span>
                </button>
                <button type="button" onClick={() => setPaymentType("Store Pickup")} className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${paymentType === 'Store Pickup' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : 'border-gray-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 text-gray-600 dark:text-gray-400'}`}>
                  <Store className="w-6 h-6" /> <span className="font-bold">Store Pickup</span>
                </button>
              </div>

              {paymentType === "Mobile Money" && (
                <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-6 mb-8 border border-gray-100 dark:border-slate-700/50">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4">Payment Instructions</h3>
                  <div className="space-y-2 mb-6 text-sm text-gray-600 dark:text-gray-300">
                    <p>1. Send exactly <strong className="text-gray-900 dark:text-white">K{Number(order.total_amount).toFixed(2)}</strong> to one of our numbers:</p>
                    <ul className="list-disc pl-5 font-mono text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-900 p-3 rounded-lg border border-gray-200 dark:border-slate-700">
                      <li>MTN: 096 123 4567 (TechStore Ltd)</li>
                      <li>Airtel: 097 123 4567 (TechStore Ltd)</li>
                    </ul>
                    <p>2. Enter the transaction ID or upload a screenshot of the receipt below.</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Transaction ID</label>
                      <Input 
                        placeholder="e.g. 192837465" 
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        className="bg-white dark:bg-slate-900"
                      />
                    </div>
                    <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-3 text-gray-400" />
                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload receipt</span></p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG or PDF</p>
                            </div>
                            <input type="file" className="hidden" accept="image/*,.pdf" onChange={(e) => setProofFile(e.target.files?.[0] || null)} />
                        </label>
                    </div>
                    {proofFile && <p className="text-sm text-green-600 dark:text-green-400 font-medium text-center">Selected file: {proofFile.name}</p>}
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full h-14 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg" disabled={submitting}>
                {submitting ? "Submitting..." : `Confirm ${paymentType}`}
              </Button>
            </form>
          </div>
        )}

        {paymentSuccess && (
          <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-2xl p-8 mb-8 text-center flex flex-col items-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-extrabold text-green-900 dark:text-green-100 mb-2">Payment Details Submitted</h2>
            <p className="text-green-700 dark:text-green-300">Your order is now being processed. We will notify you once it's verified.</p>
          </div>
        )}

        {/* Order Items & Summary */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
          <div className="p-6 sm:p-8">
            <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-6">Order Items</h3>
            <div className="space-y-6">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex items-center gap-4 py-4 border-b border-gray-50 dark:border-slate-800/50 last:border-0 last:pb-0">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-slate-800 rounded-xl flex-shrink-0 border border-gray-200 dark:border-slate-700">
                    <img 
                      src={`https://via.placeholder.com/200x200.png?text=${encodeURIComponent(item.product.name)}`}
                      alt={item.product.name}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white truncate">{item.product.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-lg font-extrabold text-gray-900 dark:text-white">
                    K{Number(item.total_price).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 border-t border-gray-100 dark:border-slate-800 pt-8 flex justify-between items-center">
              <span className="text-xl font-medium text-gray-500 dark:text-gray-400">Total Amount</span>
              <span className="text-3xl font-extrabold text-gray-900 dark:text-white">K{Number(order.total_amount).toFixed(2)}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
