"use client";

import { useCartStore } from "@/store/cartStore";
import { X, Plus, Minus, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCartStore();

  const total = cart.reduce(
    (sum, item) => sum + (item.discountPrice || item.price) * item.qty,
    0
  );

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your entire cart?")) {
      clearCart();
      toast.success(`Cart cleared`, {
                  style: {
                    borderRadius: "8px",
                    background: "#0A0A0A", // black background
                    color: "#fff",
                    fontSize: "14px",
                    padding: "12px 16px",
                    border: "1px solid #D4AF37", // gold border
                  },
                  iconTheme: {
                    primary: "#D4AF37", // gold icon color
                    secondary: "#0A0A0A", // icon background
                  },
                });
    }
  };

  const handleRemoveItem = (id) => {
    removeFromCart(id);
    toast.success(`Item removed`, {
                  style: {
                    borderRadius: "8px",
                    background: "#0A0A0A", // black background
                    color: "#fff",
                    fontSize: "14px",
                    padding: "12px 16px",
                    border: "1px solid #D4AF37", // gold border
                  },
                  iconTheme: {
                    primary: "#D4AF37", // gold icon color
                    secondary: "#0A0A0A", // icon background
                  },
                });
  };

  const handleQuantityChange = (id, newQty) => {
    if (newQty < 1) return;
    updateQuantity(id, newQty);
    toast.success("Quantity updated", {
                  style: {
                    borderRadius: "8px",
                    background: "#0A0A0A", // black background
                    color: "#fff",
                    fontSize: "14px",
                    padding: "12px 16px",
                    border: "1px solid #D4AF37", // gold border
                  },
                  iconTheme: {
                    primary: "#D4AF37", // gold icon color
                    secondary: "#0A0A0A", // icon background
                  },
                });
  };
  console.log(cart)

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white px-4 py-10  pt-[120px] mx-auto">
      <div className="flex justify-around items-center mb-8">
        <h1 className="text-3xl font-bold">My Cart</h1>
        {cart.length > 0 && (
          <button
            onClick={handleClearCart}
            className="text-sm text-red-400 hover:text-red-500 transition-colors"
          >
            Clear Cart
          </button>
        )}
      </div>

      {cart.length === 0 ? (
        <div className="text-center mt-20">
          <p className="text-gray-400 mb-6">Your cart is empty.</p>
          <Link
            href="/collection"
            className="bg-[#D4AF37] text-black font-semibold px-6 py-3 rounded-2xl hover:bg-[#c39a2f] transition-colors inline-block"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
        {/* <div className="w-full flex items-center justify-center"> */}

          <div className="w-[55%] mx-auto space-y-6">
            <AnimatePresence>
              {cart.map((item) => (
                <motion.div
                key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col sm:flex-row sm:items-center justify-between border border-[#2A2A2A] rounded-2xl p-4 transition-all duration-300 hover:border-[#D4AF37] hover:shadow-[0_0_15px_#D4AF37] hover:scale-[1.01]"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 relative flex-shrink-0">
                      <Image
                        src={item.images[0].url}
                        alt={item.title}
                        fill
                        className="object-cover rounded-xl"
                      />
                    </div>
                    <div>
                      <Link href={`/singleproduct/${item._id}`}>
                        <h2 className="font-semibold text-white hover:text-[#D4AF37] transition-colors">
                          {item.title}
                        </h2>
                      </Link>
                      <p className="text-[#D4AF37] font-bold mt-1">
                        ${item.discountPrice || item.price}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-4 sm:mt-0 ">
                    <div className="flex items-center border transition-all border-[#443a1a]  hover:border-[#D4AF37] shadow-sm rounded-lg overflow-hidden">
                      <button
                        onClick={() => handleQuantityChange(item._id, item.qty - 1)}
                        className="px-2 py-1  hover:bg-[#D4AF37]/30 transition-colors"
                        >
                        <Minus size={14} className="hover:text-[#D4AF37]" />
                      </button>
                      <span className="px-3">{item.qty}</span>
                      <button
                        onClick={() => handleQuantityChange(item._id, item.qty + 1)}
                        className="px-2 py-1 hover:bg-[#D4AF37]/30 transition-colors"
                        >
                        <Plus size={14} className="hover:text-[#D4AF37]" />
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item._id)}
                      className="text-red-400 hover:text-red-500 transition-colors"
                      >
                      <X size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
              </div>
          {/* </div> */}

          <div className="mt-8 flex flex-col sm:flex-row justify-around  items-center gap-4 border-t border-[#2A2A2A] pt-12">
            <h2 className="text-xl font-semibold">
              Total: <span className="text-[#D4AF37]">${total.toFixed(2)}</span>
            </h2>
                <Link href={"/checkout"}>
      <button className="group bg-[#D4AF37] cursor-pointer text-black font-semibold px-8 py-3 rounded-2xl hover:bg-[#c39a2f] transition-colors shadow-lg shadow-[#D4AF37]/40 flex items-center gap-2">
        Checkout 
        <ArrowRight 
          size={18} 
          className="transition-transform duration-300 group-hover:translate-x-2" 
        />
      </button>
    </Link>
          </div>
        </>
      )}
    </div>
  );
}
