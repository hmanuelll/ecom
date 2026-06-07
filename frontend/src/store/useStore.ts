import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string | number;
  name: string;
  email: string;
  role: string;
  phone?: string;
  addresses?: any[];
}

export interface CartItem {
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface StoreState {
  user: User | null;
  setUser: (user: User | null) => void;
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  wishlist: any[];
  addToWishlist: (product: any) => void;
  removeFromWishlist: (productId: number) => void;
  toast: { message: string; visible: boolean; type: 'success' | 'error' | 'info' };
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      cart: [],
      toast: { message: "", visible: false, type: 'success' },
      showToast: (message, type = 'success') => {
        set({ toast: { message, visible: true, type } });
        setTimeout(() => {
          set({ toast: { message: "", visible: false, type } });
        }, 3000);
      },
      hideToast: () => set((state) => ({ toast: { ...state.toast, visible: false } })),
      addToCart: (item) => set((state) => {
        const existing = state.cart.find(i => i.product_id === item.product_id);
        if (existing) {
          return { cart: state.cart.map(i => i.product_id === item.product_id ? { ...i, quantity: i.quantity + item.quantity } : i) };
        }
        return { cart: [...state.cart, item] };
      }),
      updateQuantity: (productId, quantity) => set((state) => ({
        cart: state.cart.map(i => i.product_id === productId ? { ...i, quantity } : i)
      })),
      removeFromCart: (productId) => set((state) => ({
        cart: state.cart.filter(i => i.product_id !== productId)
      })),
      clearCart: () => set({ cart: [] }),
      wishlist: [],
      addToWishlist: (product) => set((state) => {
        if (!state.wishlist.find(p => p.id === product.id)) {
          return { wishlist: [...state.wishlist, product] };
        }
        return state;
      }),
      removeFromWishlist: (productId) => set((state) => ({
        wishlist: state.wishlist.filter(p => p.id !== productId)
      })),
    }),
    {
      name: 'techstore-storage',
      partialize: (state) => ({ user: state.user, cart: state.cart, wishlist: state.wishlist }),
    }
  )
);
