import { create } from "zustand";
import axios from "axios";

const PAGE_SIZE = 10;

export const useProductStore = create((set, get) => ({
  products: [],
  hasMore: true,
  page: 1,
  loading: false,
  cancelToken: null,

  fetchProducts: async (filters = {}, append = false) => {
    if (get().loading) return;

    // Cancel previous request if exists
    if (get().cancelToken) {
      get().cancelToken.cancel("Request canceled due to new request");
    }

    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    set({ 
      loading: true,
      cancelToken: source
    });

    try {
      const queryParams = new URLSearchParams({
        page: get().page.toString(),
        ...(filters.category && { category: filters.category }),
        ...(filters.subcategory && { subcategory: filters.subcategory }),
        ...(filters.subsubcategory && { subsubcategory: filters.subsubcategory }),
      });

      const res = await axios.get(`/api/getproducts?${queryParams.toString()}`, {
        cancelToken: source.token
      });

      if (res.data.success) {
        set((state) => ({
          products: append ? [...state.products, ...res.data.products] : res.data.products,
          hasMore: res.data.hasMore,
          page: append ? state.page + 1 : 2,
        }));
      }
    } catch (err) {
      if (!axios.isCancel(err)) {
        console.error("Error fetching products:", err);
      }
    } finally {
      set({ 
        loading: false,
        cancelToken: null
      });
    }
  },

  reset: () => set({ products: [], hasMore: true, page: 1, cancelToken: null }),
}));
// import { create } from "zustand";

// export const useProductStore = create((set, get) => ({
//   products: [],
//   hasMore: true,
//   page: 1,
//   loading: false,

//   fetchProducts: async (filters = {}, append = false) => {
//     if (get().loading) return;

//     set({ loading: true });
//     try {
//       const queryParams = new URLSearchParams({
//         page: get().page.toString(),
//         ...(filters.category && { category: filters.category }),
//         ...(filters.subcategory && { subcategory: filters.subcategory }),
//         ...(filters.subsubcategory && { subsubcategory: filters.subsubcategory }),
//       });

//       const res = await fetch(`/api/getproducts?${queryParams.toString()}`);
//       const data = await res.json();

//       if (data.success) {
//         set((state) => ({
//           products: append ? [...state.products, ...data.products] : data.products,
//           hasMore: data.products.length > 0,
//           page: append ? state.page + 1 : 2,
//         }));
//       }
//     } catch (err) {
//       console.error("Error fetching products:", err);
//     } finally {
//       set({ loading: false });
//     }
//   },

//   reset: () => set({ products: [], hasMore: true, page: 1 }),
// }));
