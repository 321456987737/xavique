import { create } from "zustand";

export const useProductStore = create((set, get) => ({
  products: [],
  hasMore: true,
  page: 1,
  loading: false,

  fetchProducts: async (filters = {}, append = false) => {
    if (get().loading) return;

    set({ loading: true });
    try {
      const queryParams = new URLSearchParams({
        page: get().page.toString(),
        ...(filters.category && { category: filters.category }),
        ...(filters.subcategory && { subcategory: filters.subcategory }),
        ...(filters.subsubcategory && { subsubcategory: filters.subsubcategory }),
      });

      const res = await fetch(`/api/getproducts?${queryParams.toString()}`);
      const data = await res.json();

      if (data.success) {
        set((state) => ({
          products: append ? [...state.products, ...data.products] : data.products,
          hasMore: data.products.length > 0,
          page: append ? state.page + 1 : 2,
        }));
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      set({ loading: false });
    }
  },

  reset: () => set({ products: [], hasMore: true, page: 1 }),
}));
