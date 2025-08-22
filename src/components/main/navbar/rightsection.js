"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { User, Heart, ShoppingBag } from "lucide-react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import axios from "axios";
import { useCartStore } from "@/store/cartStore";

export default function Rightsection() {
  const { data: session } = useSession();
  const { cart } = useCartStore();
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    const fetchWishlistCount = async () => {
      if (!session?.user?.id) {
        setWishlistCount(0);
        return;
      }
      try {
        const res = await axios.get(`/api/wishlist?userId=${session.user.id}`);
        const items = res.data.wishlist?.items || [];
        setWishlistCount(items.length);
      } catch (err) {
        console.error("Failed to fetch wishlist count", err);
        setWishlistCount(0);
      }
    };

    fetchWishlistCount();
  }, [session?.user?.id]);

  return (
    <div className="flex items-center justify-center h-[80px] gap-2 md:gap-6">
      {/* User Account */}
      <div className="relative">
        <Link href={session ? "/dashboard" : "/signin"}>
          <motion.div
            className="group relative md:p-3 p-1.5 rounded-full hover:bg-[#D4AF37]/10 transition-all duration-300 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <User
              size={22}
              strokeWidth={1.5}
              className="text-white md:w-[22px] md:h-[22px] h-[18px] w-[18px] group-hover:text-[#D4AF37] transition-colors duration-300"
            />
            <div className="absolute inset-0 rounded-full bg-[#D4AF37]/20 scale-0 group-hover:scale-100 transition-transform duration-300" />
          </motion.div>
        </Link>
      </div>

      {/* Wishlist */}
      <div>
        <Link href="/wishlist">
          <motion.div
            className="group relative md:p-3 p-1.5 rounded-full hover:bg-[#D4AF37]/10 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Heart
              size={22}
              strokeWidth={1.5}
              className="text-white md:w-[22px] md:h-[22px] h-[18px] w-[18px] group-hover:text-[#D4AF37] transition-colors duration-300"
            />
            <div className="absolute inset-0 rounded-full bg-[#D4AF37]/20 scale-0 group-hover:scale-100 transition-transform duration-300" />
            {/* Wishlist Count Badge */}
            {wishlistCount > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-[#E74C3C] to-[#C0392B] rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {wishlistCount}
                </span>
              </div>
            )}
          </motion.div>
        </Link>
      </div>

      {/* Cart */}
      <div>
        <Link href="/cart">
          <motion.div
            className="group relative md:p-3 p-1.5 rounded-full hover:bg-[#D4AF37]/10 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ShoppingBag
              size={22}
              strokeWidth={1.5}
              className="text-white md:w-[22px] md:h-[22px] h-[18px] w-[18px] group-hover:text-[#D4AF37] transition-colors duration-300"
            />
            <div className="absolute inset-0 rounded-full bg-[#D4AF37]/20 scale-0 group-hover:scale-100 transition-transform duration-300" />
            {/* Cart Count Badge */}
            {cart.length > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] rounded-full flex items-center justify-center">
                <span className="text-black text-xs font-bold">
                  {cart.length}
                </span>
              </div>
            )}
          </motion.div>
        </Link>
      </div>
    </div>
  );
}
