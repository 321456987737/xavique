// store/cartStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],

      addToCart: (product, qty = 1, selectedOptions = {}) => {
        const cart = get().cart;
        const existing = cart.find(
          (item) =>
            item._id === product._id &&
            item.selectedOptions.color === selectedOptions.color &&
            item.selectedOptions.size === selectedOptions.size
        );

        if (existing) {
          // If same product with same options exists → increase quantity
          set({
            cart: cart.map((item) =>
              item._id === product._id &&
              item.selectedOptions.color === selectedOptions.color &&
              item.selectedOptions.size === selectedOptions.size
                ? { ...item, qty: item.qty + qty }
                : item
            ),
          });
        } else {
          // Add new entry with selected options
          set({
            cart: [
              ...cart,
              { ...product, qty, selectedOptions },
            ],
          });
        }
      },

      removeFromCart: (id, selectedOptions = {}) => {
        set({
          cart: get().cart.filter(
            (item) =>
              !(
                item._id === id &&
                item.selectedOptions.color === selectedOptions.color &&
                item.selectedOptions.size === selectedOptions.size
              )
          ),
        });
      },

      updateQuantity: (id, qty, selectedOptions = {}) => {
        set({
          cart: get().cart.map((item) =>
            item._id === id &&
            item.selectedOptions.color === selectedOptions.color &&
            item.selectedOptions.size === selectedOptions.size
              ? { ...item, qty }
              : item
          ),
        });
      },

      clearCart: () => set({ cart: [] }),
    }),
    {
      name: "cart-storage", // key in localStorage
    }
  )
);

// // store/cartStore.js
// import { create } from "zustand";
// import { persist } from "zustand/middleware";

// export const useCartStore = create(
//   persist(
//     (set, get) => ({
//       cart: [],

//       addToCart: (product, qty = 1) => {
//         const cart = get().cart;
//         const existing = cart.find((item) => item._id === product._id);

//         if (existing) {
//           // update quantity
//           set({
//             cart: cart.map((item) =>
//               item._id === product._id
//                 ? { ...item, qty: item.qty + qty }
//                 : item
//             ),
//           });
//         } else {
//           set({ cart: [...cart, { ...product, qty }] });
//         }
//       },

//       removeFromCart: (id) => {
//         set({ cart: get().cart.filter((item) => item._id !== id) });
//       },

//       updateQuantity: (id, qty) => {
//         set({
//           cart: get().cart.map((item) =>
//             item._id === id ? { ...item, qty } : item
//           ),
//         });
//       },

//       clearCart: () => set({ cart: [] }),
//     }),
//     {
//       name: "cart-storage", // key in localStorage
//     }
//   )
// );
