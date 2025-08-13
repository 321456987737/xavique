// store/wishlistStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      wishlist: [],

      addToWishlist: (product) => {
        const wishlist = get().wishlist;
        if (!wishlist.find((item) => item._id === product._id)) {
          set({ wishlist: [...wishlist, product] });
        }
      },

      removeFromWishlist: (id) => {
        set({ wishlist: get().wishlist.filter((item) => item._id !== id) });
      },

      clearWishlist: () => set({ wishlist: [] }),
    }),
    {
      name: "wishlist-storage", // key in localStorage
    }
  )
);
