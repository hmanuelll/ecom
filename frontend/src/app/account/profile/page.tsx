"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

import { AlertCircle } from "lucide-react";

export default function ProfilePage() {
  const { user, setUser, showToast } = useStore();
  const [editingField, setEditingField] = useState<string | null>(null);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [addressLine1, setAddressLine1] = useState(user?.addresses?.[0]?.address_line1 || "");
  const [city, setCity] = useState(user?.addresses?.[0]?.city || "");
  const [state, setState] = useState(user?.addresses?.[0]?.state || "");
  const [zipCode, setZipCode] = useState(user?.addresses?.[0]?.zip_code || "");

  if (!user) return null;

  const maskEmail = (email: string) => {
    if (!email) return "";
    const parts = email.split("@");
    if (parts.length !== 2) return email;
    const [name, domain] = parts;
    if (name.length <= 2) return `${name[0]}***@${domain}`;
    return `${name[0]}***${name[name.length - 1]}@${domain}`;
  };

  const maskPhone = (phone?: string) => {
    if (!phone) return "Not provided";
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length < 4) return phone;
    return `${cleaned[0]}xxxxxxxx${cleaned.slice(-2)}`;
  };

  const handleSave = async (field: string) => {
    try {
      const userDocRef = doc(db, "users", user.id as string);
      if (field === "address") {
        const updatedAddresses = [{
          address_line1: addressLine1,
          city,
          state,
          zip_code: zipCode,
          country: "Zambia"
        }];
        await updateDoc(userDocRef, {
          addresses: updatedAddresses
        });
        setUser({
          ...user,
          addresses: updatedAddresses
        });
      } else {
        await updateDoc(userDocRef, {
          name,
          email,
          phone
        });
        setUser({
          ...user,
          name,
          email,
          phone
        });
      }
      setEditingField(null);
      showToast("Updated successfully", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to update", "error");
    }
  };

  const hasAddress = user.addresses && user.addresses.length > 0;

  return (
    <div className="space-y-6">
      {!hasAddress && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-600 p-4 rounded-r-lg flex items-start">
          <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-bold text-yellow-800 dark:text-yellow-200">Complete Your Account</h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">Please complete your account information by adding a shipping address to speed up your checkout process.</p>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 shadow-sm rounded-2xl border border-gray-100 dark:border-slate-800 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100 dark:border-slate-800">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Personal info</h1>
        </div>

      <div className="divide-y divide-gray-100 dark:divide-slate-800">
        
        {/* Username Row */}
        <div className="px-8 py-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <div className="text-sm font-bold text-gray-900 dark:text-white">Username</div>
          <div className="md:col-span-2 flex justify-between items-start">
            {editingField === "name" ? (
              <div className="w-full flex gap-3">
                <Input value={name} onChange={(e) => setName(e.target.value)} className="max-w-xs dark:bg-slate-800 dark:border-slate-700" />
                <Button onClick={() => handleSave("name")} className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white">Save</Button>
                <Button variant="outline" onClick={() => setEditingField(null)} className="cursor-pointer dark:bg-slate-800 dark:border-slate-700 dark:text-gray-300">Cancel</Button>
              </div>
            ) : (
              <>
                <span className="text-gray-700 dark:text-gray-300 text-base">{user.name}</span>
                <button onClick={() => setEditingField("name")} className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium cursor-pointer">Edit</button>
              </>
            )}
          </div>
        </div>

        {/* Account Type Row */}
        <div className="px-8 py-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <div className="text-sm font-bold text-gray-900 dark:text-white">Account type</div>
          <div className="md:col-span-2 flex justify-between items-start">
            <span className="text-gray-700 dark:text-gray-300 text-base capitalize">{user.role || "Individual"}</span>
          </div>
        </div>

        {/* Contact Details Header */}
        <div className="px-8 py-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <div className="text-sm font-bold text-gray-900 dark:text-white">Contact details</div>
          <div className="md:col-span-2 space-y-8">
            
            {/* Email */}
            <div className="flex justify-between items-start">
              {editingField === "email" ? (
                <div className="w-full flex gap-3">
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="max-w-xs dark:bg-slate-800 dark:border-slate-700" />
                  <Button onClick={() => handleSave("email")} className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white">Save</Button>
                  <Button variant="outline" onClick={() => setEditingField(null)} className="cursor-pointer dark:bg-slate-800 dark:border-slate-700 dark:text-gray-300">Cancel</Button>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Email address</p>
                  <p className="text-gray-700 dark:text-gray-300 text-base">{maskEmail(user.email)}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Verified</p>
                </div>
              )}
              {editingField !== "email" && (
                <button onClick={() => setEditingField("email")} className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium cursor-pointer">Edit</button>
              )}
            </div>

            <div className="border-t border-gray-100 dark:border-slate-800"></div>

            {/* Phone */}
            <div className="flex justify-between items-start">
              {editingField === "phone" ? (
                <div className="w-full flex gap-3">
                  <Input 
                    value={phone} 
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setPhone(val);
                    }} 
                    maxLength={10}
                    placeholder="09xxxxxxx" 
                    className="max-w-xs dark:bg-slate-800 dark:border-slate-700" 
                  />
                  <Button onClick={() => handleSave("phone")} disabled={phone.length > 0 && phone.length !== 10} className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50">Save</Button>
                  <Button variant="outline" onClick={() => setEditingField(null)} className="cursor-pointer dark:bg-slate-800 dark:border-slate-700 dark:text-gray-300">Cancel</Button>
                </div>
              ) : (
                <>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Phone number</p>
                    <p className="text-gray-700 dark:text-gray-300 text-base">{maskPhone(user.phone)}</p>
                  </div>
                  <button onClick={() => setEditingField("phone")} className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium cursor-pointer">Edit</button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Address Row */}
        <div className="px-8 py-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <div className="text-sm font-bold text-gray-900 dark:text-white">Address</div>
          <div className="md:col-span-2 flex justify-between items-start">
            {editingField === "address" ? (
              <div className="w-full space-y-4">
                <Input value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} placeholder="Address Line 1" className="dark:bg-slate-800 dark:border-slate-700 max-w-sm" />
                <div className="flex gap-4 max-w-sm">
                  <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className="dark:bg-slate-800 dark:border-slate-700" />
                  <Input value={state} onChange={(e) => setState(e.target.value)} placeholder="State" className="dark:bg-slate-800 dark:border-slate-700" />
                  <Input value={zipCode} onChange={(e) => setZipCode(e.target.value)} placeholder="Zip Code" className="dark:bg-slate-800 dark:border-slate-700" />
                </div>
                <div className="flex gap-3">
                  <Button onClick={() => handleSave("address")} className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white">Save</Button>
                  <Button variant="outline" onClick={() => setEditingField(null)} className="cursor-pointer dark:bg-slate-800 dark:border-slate-700 dark:text-gray-300">Cancel</Button>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-1 text-gray-700 dark:text-gray-300 text-base">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Owner name, address</p>
                  {hasAddress ? (
                    <>
                      <p>{user.name}</p>
                      <p>{user.addresses?.[0]?.address_line1}</p>
                      {user.addresses?.[0]?.address_line2 && <p>{user.addresses?.[0]?.address_line2}</p>}
                      <p>{user.addresses?.[0]?.city}, {user.addresses?.[0]?.state} {user.addresses?.[0]?.zip_code}</p>
                      <p>{user.addresses?.[0]?.country}</p>
                    </>
                  ) : (
                    <p className="text-red-500 italic">No address provided</p>
                  )}
                </div>
                <button onClick={() => setEditingField("address")} className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium cursor-pointer">Edit</button>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
    </div>
  );
}
