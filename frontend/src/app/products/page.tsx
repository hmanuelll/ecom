"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

const categoryImages: Record<string, string> = {
  smartphones: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=400&auto=format&fit=crop",
  laptops: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=400&auto=format&fit=crop",
  gaming: "https://images.unsplash.com/photo-1605901309584-818e25960b8f?q=80&w=400&auto=format&fit=crop",
  audio: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=400&auto=format&fit=crop",
  wearables: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=400&auto=format&fit=crop",
};

function FilterSection({ title, options, selected, onChange }: { title: string, options: string[], selected: string[], onChange: (val: string) => void }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="border-b border-gray-200 dark:border-slate-700 py-4">
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center justify-between w-full text-left font-bold text-gray-900 dark:text-white mb-2">
        {title}
        <span className="text-gray-400 text-xl font-light">{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && (
        <div className="space-y-2 mt-3">
          {options.map(opt => (
            <label key={opt} className="flex items-center space-x-3 cursor-pointer text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors">
              <input type="checkbox" checked={selected.includes(opt)} onChange={() => onChange(opt)} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer" />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

function ProductsGrid() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const os = searchParams.get("os");
  const type = searchParams.get("type");

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [prevParams, setPrevParams] = useState(searchParams.toString());

  if (searchParams.toString() !== prevParams) {
    setPrevParams(searchParams.toString());
    setLoading(true);
  }

  // Filters State
  const [selectedCpus, setSelectedCpus] = useState<string[]>([]);
  const [selectedRams, setSelectedRams] = useState<string[]>([]);
  const [selectedStorages, setSelectedStorages] = useState<string[]>([]);
  const [selectedGpus, setSelectedGpus] = useState<string[]>([]);
  const [selectedOs, setSelectedOs] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  
  const [priceInput, setPriceInput] = useState({ min: "", max: "" });

  const toggleFilter = (setFn: React.Dispatch<React.SetStateAction<string[]>>, val: string) => {
    setFn(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]);
  };

  useEffect(() => {
    setSelectedCpus([]);
    setSelectedRams([]);
    setSelectedStorages([]);
    setSelectedGpus([]);
    setSelectedOs([]);
    setSelectedBrands([]);
    setMinPrice("");
    setMaxPrice("");
    setPriceInput({ min: "", max: "" });
  }, [category]);

  const handlePriceRangePreset = (min: string, max: string) => {
    // If clicking the same preset, clear it
    if (minPrice === min && maxPrice === max) {
      setMinPrice("");
      setMaxPrice("");
    } else {
      setMinPrice(min);
      setMaxPrice(max);
    }
  };  useEffect(() => {
    setLoading(true);
    
    const fetchAndFilterProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        let data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // 1. Filter by category
        if (category && category !== 'featured') {
          data = data.filter((p: any) => p.category?.slug === category);
        }
        
        // 2. Filter by search query
        if (search) {
          const q = search.toLowerCase();
          data = data.filter((p: any) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
        }

        // 3. Filter by os (legacy/url)
        if (os && category !== 'smartphones') {
          data = data.filter((p: any) => p.attributes?.os?.toLowerCase() === os.toLowerCase());
        }

        // 4. Filter by type (accessories: audio vs wearables)
        if (type) {
          data = data.filter((p: any) => p.attributes?.type === type);
        }

        // 5. Filter by processor (cpu)
        if (selectedCpus.length > 0) {
          data = data.filter((p: any) => selectedCpus.includes(p.attributes?.cpu));
        }

        // 6. Filter by RAM
        if (selectedRams.length > 0) {
          data = data.filter((p: any) => selectedRams.includes(p.attributes?.ram));
        }

        // 7. Filter by storage
        if (selectedStorages.length > 0) {
          data = data.filter((p: any) => selectedStorages.includes(p.attributes?.storage));
        }

        // 8. Filter by GPU
        if (selectedGpus.length > 0) {
          data = data.filter((p: any) => selectedGpus.includes(p.attributes?.gpu));
        }

        // 9. Filter by OS (sidebar)
        if (selectedOs.length > 0) {
          data = data.filter((p: any) => selectedOs.includes(p.attributes?.os));
        }

        // 10. Filter by brand
        if (selectedBrands.length > 0) {
          data = data.filter((p: any) => selectedBrands.some(b => {
            const brand = b.toLowerCase();
            const name = p.name.toLowerCase();
            if (brand === 'apple' && (name.includes('macbook') || name.includes('mac') || name.includes('ipad') || name.includes('iphone') || name.includes('airpods'))) return true;
            return name.includes(brand);
          }));
        }

        // 11. Filter by price
        if (minPrice) {
          data = data.filter((p: any) => Number(p.price) >= Number(minPrice));
        }
        if (maxPrice) {
          data = data.filter((p: any) => Number(p.price) <= Number(maxPrice));
        }

        // Artificial delay for loading experience
        await new Promise(resolve => setTimeout(resolve, 500));
        setProducts(data);
      } catch (err) {
        console.error("Error fetching/filtering products from Firestore:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAndFilterProducts();
  }, [category, search, os, type, selectedCpus, selectedRams, selectedStorages, selectedGpus, selectedOs, selectedBrands, minPrice, maxPrice]);

  const displayTitle = category ? category.charAt(0).toUpperCase() + category.slice(1) : "All Products";

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row gap-8 items-start">
      
      {/* Sidebar Filters */}
      {category === 'laptops' && (
        <div className="w-full md:w-64 shrink-0 bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 p-5 sticky top-24">
          <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2">Filters</h2>
          <div className="flex justify-between items-center mb-4">
             <span className="text-xs text-gray-500">{products.length} Results</span>
             <button onClick={() => { setSelectedCpus([]); setSelectedRams([]); setSelectedStorages([]); setSelectedGpus([]); setMinPrice(''); setMaxPrice(''); }} className="text-xs text-blue-600 hover:underline">Clear all</button>
          </div>

          <FilterSection title="Processor" options={['Intel Core i3', 'Intel Core i5', 'Intel Core i7', 'AMD']} selected={selectedCpus} onChange={(v) => toggleFilter(setSelectedCpus, v)} />
          <FilterSection title="RAM" options={['4GB', '8GB', '16GB', '32GB']} selected={selectedRams} onChange={(v) => toggleFilter(setSelectedRams, v)} />
          <FilterSection title="SSD Capacity" options={['128GB SSD', '256GB SSD', '512GB SSD', '1TB SSD']} selected={selectedStorages} onChange={(v) => toggleFilter(setSelectedStorages, v)} />
          <FilterSection title="Graphics Processing Type" options={['Intel', 'AMD', 'Nvidia']} selected={selectedGpus} onChange={(v) => toggleFilter(setSelectedGpus, v)} />
          
          {/* Price Filter */}
          <div className="py-4">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Price</h3>
            <div className="space-y-3 mb-6">
              {[
                { label: 'Under K10,000', min: '', max: '10000' },
                { label: 'K10,000 to K20,000', min: '10000', max: '20000' },
                { label: 'Under K30,000', min: '', max: '30000' },
                { label: 'K30,000 to K45,000', min: '30000', max: '45000' },
                { label: 'Over K45,000', min: '45000', max: '' }
              ].map(range => (
                <label key={range.label} className="flex items-center space-x-3 cursor-pointer text-sm text-gray-700 dark:text-gray-300">
                  <input type="checkbox" checked={minPrice === range.min && maxPrice === range.max} onChange={() => handlePriceRangePreset(range.min, range.max)} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer" />
                  <span>{range.label}</span>
                </label>
              ))}
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="relative w-full">
                <span className="absolute inset-y-0 left-0 pl-2 flex items-center text-gray-500 pointer-events-none text-xs">K</span>
                <input type="number" placeholder="Min." value={priceInput.min} onChange={e => setPriceInput({...priceInput, min: e.target.value})} className="pl-6 block w-full rounded-md border-gray-300 dark:border-slate-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-slate-800" />
              </div>
              <span className="text-gray-500">to</span>
              <div className="relative w-full">
                <span className="absolute inset-y-0 left-0 pl-2 flex items-center text-gray-500 pointer-events-none text-xs">K</span>
                <input type="number" placeholder="Max." value={priceInput.max} onChange={e => setPriceInput({...priceInput, max: e.target.value})} className="pl-6 block w-full rounded-md border-gray-300 dark:border-slate-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-slate-800" />
              </div>
              <button onClick={() => { setMinPrice(priceInput.min); setMaxPrice(priceInput.max); }} className="p-2 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-md transition-colors flex items-center justify-center">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      )}

      {category === 'smartphones' && (
        <div className="w-full md:w-64 shrink-0 bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 p-5 sticky top-24">
          <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2">Filters</h2>
          <div className="flex justify-between items-center mb-4">
             <span className="text-xs text-gray-500">{products.length} Results</span>
             <button onClick={() => { setSelectedOs([]); setSelectedRams([]); setSelectedStorages([]); setMinPrice(''); setMaxPrice(''); }} className="text-xs text-blue-600 hover:underline">Clear all</button>
          </div>

          <FilterSection title="Operating System" options={['iOS', 'Android']} selected={selectedOs} onChange={(v) => toggleFilter(setSelectedOs, v)} />
          <FilterSection title="Storage" options={['128GB', '256GB', '512GB', '1TB']} selected={selectedStorages} onChange={(v) => toggleFilter(setSelectedStorages, v)} />
          <FilterSection title="RAM" options={['4GB', '8GB', '12GB', '16GB']} selected={selectedRams} onChange={(v) => toggleFilter(setSelectedRams, v)} />
          
          {/* Price Filter */}
          <div className="py-4">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Price</h3>
            <div className="space-y-3 mb-6">
              {[
                { label: 'Under K10,000', min: '', max: '10000' },
                { label: 'K10,000 to K20,000', min: '10000', max: '20000' },
                { label: 'Under K30,000', min: '', max: '30000' },
                { label: 'K30,000 to K45,000', min: '30000', max: '45000' },
                { label: 'Over K45,000', min: '45000', max: '' }
              ].map(range => (
                <label key={range.label} className="flex items-center space-x-3 cursor-pointer text-sm text-gray-700 dark:text-gray-300">
                  <input type="checkbox" checked={minPrice === range.min && maxPrice === range.max} onChange={() => handlePriceRangePreset(range.min, range.max)} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer" />
                  <span>{range.label}</span>
                </label>
              ))}
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="relative w-full">
                <span className="absolute inset-y-0 left-0 pl-2 flex items-center text-gray-500 pointer-events-none text-xs">K</span>
                <input type="number" placeholder="Min." value={priceInput.min} onChange={e => setPriceInput({...priceInput, min: e.target.value})} className="pl-6 block w-full rounded-md border-gray-300 dark:border-slate-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-slate-800" />
              </div>
              <span className="text-gray-500">to</span>
              <div className="relative w-full">
                <span className="absolute inset-y-0 left-0 pl-2 flex items-center text-gray-500 pointer-events-none text-xs">K</span>
                <input type="number" placeholder="Max." value={priceInput.max} onChange={e => setPriceInput({...priceInput, max: e.target.value})} className="pl-6 block w-full rounded-md border-gray-300 dark:border-slate-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-slate-800" />
              </div>
              <button onClick={() => { setMinPrice(priceInput.min); setMaxPrice(priceInput.max); }} className="p-2 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-md transition-colors flex items-center justify-center">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      )}

      {(category === 'gaming' || category === 'accessories') && (
        <div className="w-full md:w-64 shrink-0 bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 p-5 sticky top-24">
          <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2">Filters</h2>
          <div className="flex justify-between items-center mb-4">
             <span className="text-xs text-gray-500">{products.length} Results</span>
             <button onClick={() => { setSelectedBrands([]); setMinPrice(''); setMaxPrice(''); }} className="text-xs text-blue-600 hover:underline">Clear all</button>
          </div>

          <FilterSection 
            title="Brand" 
            options={category === 'gaming' ? ['PlayStation', 'Xbox', 'Nintendo', 'Logitech', 'Razer'] : ['Apple', 'Samsung', 'Garmin', 'Fitbit', 'Sony', 'Bose', 'JBL', 'Sonos']} 
            selected={selectedBrands} 
            onChange={(v) => toggleFilter(setSelectedBrands, v)} 
          />
          
          {/* Price Filter */}
          <div className="py-4">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Price</h3>
            <div className="space-y-3 mb-6">
              {[
                { label: 'Under K5,000', min: '', max: '5000' },
                { label: 'K5,000 to K10,000', min: '5000', max: '10000' },
                { label: 'K10,000 to K20,000', min: '10000', max: '20000' },
                { label: 'Over K20,000', min: '20000', max: '' }
              ].map(range => (
                <label key={range.label} className="flex items-center space-x-3 cursor-pointer text-sm text-gray-700 dark:text-gray-300">
                  <input type="checkbox" checked={minPrice === range.min && maxPrice === range.max} onChange={() => handlePriceRangePreset(range.min, range.max)} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer" />
                  <span>{range.label}</span>
                </label>
              ))}
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="relative w-full">
                <span className="absolute inset-y-0 left-0 pl-2 flex items-center text-gray-500 pointer-events-none text-xs">K</span>
                <input type="number" placeholder="Min." value={priceInput.min} onChange={e => setPriceInput({...priceInput, min: e.target.value})} className="pl-6 block w-full rounded-md border-gray-300 dark:border-slate-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-slate-800" />
              </div>
              <span className="text-gray-500">to</span>
              <div className="relative w-full">
                <span className="absolute inset-y-0 left-0 pl-2 flex items-center text-gray-500 pointer-events-none text-xs">K</span>
                <input type="number" placeholder="Max." value={priceInput.max} onChange={e => setPriceInput({...priceInput, max: e.target.value})} className="pl-6 block w-full rounded-md border-gray-300 dark:border-slate-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-slate-800" />
              </div>
              <button onClick={() => { setMinPrice(priceInput.min); setMaxPrice(priceInput.max); }} className="p-2 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-md transition-colors flex items-center justify-center">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 w-full">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8">{displayTitle}</h1>

        {category === 'laptops' && (
          <div className="mb-10">
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Shop by Brand</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {['Apple', 'HP', 'Dell', 'Lenovo', 'Asus', 'Acer'].map(brand => (
                <button 
                  key={brand}
                  onClick={() => toggleFilter(setSelectedBrands, brand)}
                  className={`flex items-center justify-center h-16 rounded-xl border-2 transition-all ${selectedBrands.includes(brand) ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-bold' : 'border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-300 hover:shadow-md text-gray-700 dark:text-gray-300 font-medium'}`}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>
        )}

        {category === 'smartphones' && (
          <div className="mb-10">
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Shop by Brand</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {['Apple', 'Samsung', 'Google', 'Xiaomi', 'Tecno', 'Infinix'].map(brand => (
                <button 
                  key={brand}
                  onClick={() => toggleFilter(setSelectedBrands, brand)}
                  className={`flex items-center justify-center h-16 rounded-xl border-2 transition-all ${selectedBrands.includes(brand) ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-bold' : 'border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-300 hover:shadow-md text-gray-700 dark:text-gray-300 font-medium'}`}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>
        )}

        {category === 'accessories' && (
          <div className="flex flex-wrap gap-3 mb-8">
            <Link href="/products?category=accessories" className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${!type ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700'}`}>All Accessories</Link>
            <Link href="/products?category=accessories&type=Audio" className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${type === 'Audio' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700'}`}>Audio</Link>
            <Link href="/products?category=accessories&type=Wearables" className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${type === 'Wearables' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700'}`}>Wearables</Link>
          </div>
        )}
        
        {loading ? (
          <LoadingSpinner text="Loading products..." />
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800">
            <p className="text-xl text-gray-500 dark:text-gray-400">No products found for this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`} className="group relative flex flex-col justify-start bg-white dark:bg-slate-800 rounded-2xl p-4 transition-all hover:shadow-xl hover:-translate-y-1 active:scale-95 border border-gray-100 dark:border-slate-700 cursor-pointer">
                <div className="aspect-square w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-slate-700 mb-4">
                  <img
                    src={product.category?.slug && categoryImages[product.category.slug] ? categoryImages[product.category.slug] : `https://via.placeholder.com/400x400.png?text=${encodeURIComponent(product.name)}`}
                    alt={product.name}
                    className="h-full w-full object-cover object-center group-hover:opacity-75 transition-opacity"
                  />
                </div>
                <div className="flex flex-col items-center mt-4 text-center">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 min-h-[56px] flex items-center justify-center">
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
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] dark:bg-slate-950 transition-colors duration-300">
      <Suspense fallback={<LoadingSpinner text="Loading catalog..." />}>
        <ProductsGrid />
      </Suspense>
    </div>
  );
}
