import { create } from "zustand";
import { getProductById } from "../data/products";

const FREE_DELIVERY_THRESHOLD = 499;

export const useStore = create((set, get) => ({
  // ----- Cart -----
  cart: [], // [{ productId, quantity, variant }]

  addToCart: (productId, quantity = 1, variant = null) => {
    set((state) => {
      const existing = state.cart.find(
        (item) => item.productId === productId && item.variant === variant
      );
      if (existing) {
        return {
          cart: state.cart.map((item) =>
            item === existing
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      }
      return { cart: [...state.cart, { productId, quantity, variant }] };
    });
    get().showToast(`Added to cart`);
  },

  removeFromCart: (productId, variant = null) => {
    set((state) => ({
      cart: state.cart.filter(
        (item) => !(item.productId === productId && item.variant === variant)
      ),
    }));
  },

  updateQuantity: (productId, variant, quantity) => {
    if (quantity < 1) {
      get().removeFromCart(productId, variant);
      return;
    }
    set((state) => ({
      cart: state.cart.map((item) =>
        item.productId === productId && item.variant === variant
          ? { ...item, quantity }
          : item
      ),
    }));
  },

  clearCart: () => set({ cart: [] }),

  // ----- Derived cart helpers -----
  getCartLines: () => {
    return get().cart.map((item) => ({
      ...item,
      product: getProductById(item.productId),
    }));
  },

  getCartCount: () => get().cart.reduce((sum, item) => sum + item.quantity, 0),

  getCartSubtotal: () => {
    return get()
      .getCartLines()
      .reduce((sum, line) => sum + (line.product?.price || 0) * line.quantity, 0);
  },

  getFreeDeliveryProgress: () => {
    const subtotal = get().getCartSubtotal();
    const remaining = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
    const pct = Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100);
    return { remaining, pct, threshold: FREE_DELIVERY_THRESHOLD };
  },

  // ----- Product detail drawer -----
  selectedProductId: null,
  openProductDetail: (id) => set({ selectedProductId: id }),
  closeProductDetail: () => set({ selectedProductId: null }),

  // ----- Search -----
  searchQuery: "",
  setSearchQuery: (q) => set({ searchQuery: q }),

  // ----- Toast -----
  toast: null,
  showToast: (message) => {
    set({ toast: message });
    clearTimeout(get()._toastTimer);
    const timer = setTimeout(() => set({ toast: null }), 2200);
    set({ _toastTimer: timer });
  },
}));
