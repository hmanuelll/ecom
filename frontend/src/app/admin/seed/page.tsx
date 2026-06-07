"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { doc, setDoc, writeBatch, collection, getDocs } from "firebase/firestore";
import { Button } from "@/components/ui/button";

const categories = [
  { id: 'smartphones', name: 'Smartphones', slug: 'smartphones', description: 'Latest mobile phones and smartphones.' },
  { id: 'laptops', name: 'Laptops', slug: 'laptops', description: 'High performance laptops for work and gaming.' },
  { id: 'gaming', name: 'Gaming', slug: 'gaming', description: 'Consoles, games, and gaming accessories.' },
  { id: 'accessories', name: 'Accessories', slug: 'accessories', description: 'Headphones, smartwatches, and more.' },
];

const products = [
  // Smartphones
  { name: 'iPhone 15 Pro Max', category: { slug: 'smartphones', name: 'Smartphones' }, description: 'The ultimate iPhone with titanium design, A17 Pro chip, and 5x optical zoom.', price: 28500.00, stock_quantity: 15, attributes: { os: 'iOS', storage: '256GB', ram: '8GB', screen: '6.7" OLED', color: 'Natural Titanium', condition: 'Brand New', features: 'Face ID, MagSafe', connectivity: '5G, Wi-Fi 6E' } },
  { name: 'Samsung Galaxy S24 Ultra', category: { slug: 'smartphones', name: 'Smartphones' }, description: 'Galaxy AI is here. Welcome to the era of mobile AI.', price: 29999.00, stock_quantity: 20, attributes: { os: 'Android', storage: '512GB', ram: '12GB', screen: '6.8" AMOLED', color: 'Titanium Black', condition: 'Brand New', features: 'S Pen, Galaxy AI', connectivity: '5G, Wi-Fi 7' } },
  { name: 'Google Pixel 8 Pro', category: { slug: 'smartphones', name: 'Smartphones' }, description: 'The best of Google AI, built around you.', price: 21500.00, stock_quantity: 10, attributes: { os: 'Android', storage: '128GB', ram: '12GB', screen: '6.7" OLED', color: 'Obsidian', condition: 'Brand New', features: 'Google AI, Magic Eraser', connectivity: '5G, Wi-Fi 7' } },
  { name: 'Xiaomi 14 Pro', category: { slug: 'smartphones', name: 'Smartphones' }, description: 'Leica optics, Snapdragon 8 Gen 3.', price: 18000.00, stock_quantity: 25, attributes: { os: 'Android', storage: '256GB', ram: '12GB', screen: '6.73" AMOLED', color: 'White', condition: 'Brand New', features: 'Leica Camera, Fast Charge', connectivity: '5G, Wi-Fi 7' } },
  { name: 'OnePlus 12', category: { slug: 'smartphones', name: 'Smartphones' }, description: 'Smooth beyond belief.', price: 16500.00, stock_quantity: 30, attributes: { os: 'Android', storage: '512GB', ram: '16GB', screen: '6.82" AMOLED', color: 'Flowy Emerald', condition: 'Brand New', features: 'Hasselblad Camera', connectivity: '5G, Wi-Fi 7' } },

  // Laptops
  { name: 'Dell Inspiron 15', category: { slug: 'laptops', name: 'Laptops' }, description: 'Reliable everyday laptop.', price: 9500.00, stock_quantity: 12, attributes: { cpu: 'Intel Core i3', ram: '4GB', storage: '128GB SSD', gpu: 'Intel', screen: '15.6"', battery: '42Wh', color: 'Silver', condition: 'Refurbished', features: 'Webcam, Numeric Keypad', connectivity: 'Wi-Fi 5, Bluetooth' } },
  { name: 'HP Pavilion 14', category: { slug: 'laptops', name: 'Laptops' }, description: 'Great value for students.', price: 15000.00, stock_quantity: 18, attributes: { cpu: 'Intel Core i5', ram: '8GB', storage: '256GB SSD', gpu: 'Intel', screen: '14.0"', battery: '50Wh', color: 'Blue', condition: 'Brand New', features: 'Fingerprint Reader', connectivity: 'Wi-Fi 6, Bluetooth' } },
  { name: 'Lenovo ThinkPad X1 Carbon', category: { slug: 'laptops', name: 'Laptops' }, description: 'Ultralight business laptop with legendary keyboard.', price: 38000.00, stock_quantity: 18, attributes: { cpu: 'Intel Core i7', ram: '16GB', storage: '512GB SSD', gpu: 'Intel', screen: '14.0"', battery: '57Wh', color: 'Black', condition: 'Brand New', features: 'Backlit Keyboard, Face ID', connectivity: 'Wi-Fi 6E, LTE' } },
  { name: 'HP Spectre x360', category: { slug: 'laptops', name: 'Laptops' }, description: 'A convertible laptop with stunning design.', price: 32000.00, stock_quantity: 15, attributes: { cpu: 'Intel Core i7', ram: '16GB', storage: '1TB SSD', gpu: 'Intel', screen: '13.5"', battery: '66Wh', color: 'Nightfall Black', condition: 'Brand New', features: 'Touchscreen, Stylus Pen', connectivity: 'Wi-Fi 6E, Bluetooth 5.3' } },
  { name: 'Asus ROG Zephyrus G14', category: { slug: 'laptops', name: 'Laptops' }, description: 'Powerful gaming laptop in a compact form factor.', price: 35000.00, stock_quantity: 8, attributes: { cpu: 'AMD', ram: '32GB', storage: '1TB SSD', gpu: 'Nvidia', screen: '14.0"', battery: '76Wh', color: 'Moonlight White', condition: 'Brand New', features: 'AniMe Matrix, 120Hz Screen', connectivity: 'Wi-Fi 6, Bluetooth' } },

  // Gaming
  { name: 'PlayStation 5 Console', category: { slug: 'gaming', name: 'Gaming' }, description: 'Lightning speed, breathtaking immersion, stunning games.', price: 12500.00, stock_quantity: 50, attributes: {} },
  { name: 'Xbox Series X', category: { slug: 'gaming', name: 'Gaming' }, description: 'The fastest, most powerful Xbox ever.', price: 12000.00, stock_quantity: 40, attributes: {} },
  { name: 'Nintendo Switch OLED', category: { slug: 'gaming', name: 'Gaming' }, description: 'Play at home or on the go with a vibrant OLED screen.', price: 8500.00, stock_quantity: 60, attributes: {} },
  { name: 'Logitech G Pro X Superlight', category: { slug: 'gaming', name: 'Gaming' }, description: 'Ultra-lightweight wireless gaming mouse.', price: 3200.00, stock_quantity: 100, attributes: {} },
  { name: 'Razer BlackWidow V4 Pro', category: { slug: 'gaming', name: 'Gaming' }, description: 'Mechanical gaming keyboard with RGB lighting.', price: 4500.00, stock_quantity: 45, attributes: {} },

  // Accessories
  { name: 'AirPods Pro (2nd Gen)', category: { slug: 'accessories', name: 'Accessories' }, description: 'Active Noise Cancellation, personalized spatial audio.', price: 5500.00, stock_quantity: 80, attributes: { type: 'Audio' } },
  { name: 'Sony WH-1000XM5', category: { slug: 'accessories', name: 'Accessories' }, description: 'Industry-leading noise canceling headphones.', price: 8500.00, stock_quantity: 35, attributes: { type: 'Audio' } },
  { name: 'Bose QuietComfort Ultra', category: { slug: 'accessories', name: 'Accessories' }, description: 'World-class noise cancellation.', price: 9000.00, stock_quantity: 25, attributes: { type: 'Audio' } },
  { name: 'JBL Charge 5', category: { slug: 'accessories', name: 'Accessories' }, description: 'Portable waterproof speaker with powerbank.', price: 3500.00, stock_quantity: 120, attributes: { type: 'Audio' } },
  { name: 'Sonos Arc', category: { slug: 'accessories', name: 'Accessories' }, description: 'Premium smart soundbar for TV, movies, music, and more.', price: 19500.00, stock_quantity: 15, attributes: { type: 'Audio' } },
  { name: 'Apple Watch Ultra 2', category: { slug: 'accessories', name: 'Accessories' }, description: 'Rugged and capable, built to meet the demands of endurance athletes.', price: 19000.00, stock_quantity: 20, attributes: { type: 'Wearables' } },
  { name: 'Samsung Galaxy Watch 6 Classic', category: { slug: 'accessories', name: 'Accessories' }, description: 'Timeless style, smart capabilities.', price: 7500.00, stock_quantity: 40, attributes: { type: 'Wearables' } },
  { name: 'Garmin Fenix 7 Pro', category: { slug: 'accessories', name: 'Accessories' }, description: 'Ultimate multisport GPS smartwatch.', price: 18500.00, stock_quantity: 10, attributes: { type: 'Wearables' } },
  { name: 'Fitbit Charge 6', category: { slug: 'accessories', name: 'Accessories' }, description: 'Advanced fitness and health tracker.', price: 3800.00, stock_quantity: 60, attributes: { type: 'Wearables' } },
  { name: 'Oura Ring Gen3', category: { slug: 'accessories', name: 'Accessories' }, description: 'Smart ring for sleep and fitness tracking.', price: 7000.00, stock_quantity: 30, attributes: { type: 'Wearables' } },
];

export default function SeedPage() {
  const [status, setStatus] = useState<string>("idle");
  const [message, setMessage] = useState<string>("");

  const handleSeed = async () => {
    setStatus("seeding");
    setMessage("");

    try {
      // 1. Seed Categories
      for (const cat of categories) {
        await setDoc(doc(db, "categories", cat.id), {
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
        });
      }
      
      // 2. Seed Products
      let count = 1;
      for (const prod of products) {
        const productSlug = prod.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        const docId = count.toString(); // Consistent numeric IDs to match dynamic routes like /products/1
        await setDoc(doc(db, "products", docId), {
          id: count,
          name: prod.name,
          slug: productSlug,
          description: prod.description,
          price: prod.price,
          stock_quantity: prod.stock_quantity,
          attributes: prod.attributes,
          category: prod.category,
        });
        count++;
      }

      setStatus("success");
      setMessage("Firestore database seeded successfully!");
    } catch (e: any) {
      console.error(e);
      setStatus("error");
      setMessage(`Seeding failed: ${e.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] dark:bg-slate-950 flex flex-col items-center justify-center p-8">
      <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-10 max-w-md w-full shadow-lg text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">Firestore Database Seeder</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Click below to populate your Firestore collections with default Categories and Products.</p>

        {status === "success" && (
          <div className="bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 p-4 rounded-xl mb-6 text-sm font-medium border border-green-200 dark:border-green-800">
            {message}
          </div>
        )}

        {status === "error" && (
          <div className="bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 p-4 rounded-xl mb-6 text-sm font-medium border border-red-200 dark:border-red-800">
            {message}
          </div>
        )}

        <Button 
          onClick={handleSeed}
          disabled={status === "seeding"}
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md cursor-pointer disabled:opacity-50"
        >
          {status === "seeding" ? "Seeding..." : "Seed Database"}
        </Button>
      </div>
    </div>
  );
}
