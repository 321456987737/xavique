"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  User,
  Heart,
  ShoppingBag,
  LogOut,
  Settings,
  Crown,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

export default function Rightsection() {
  const { data: session } = useSession();

  return (
    <div className="flex items-center justify-center h-[80px] gap-6">
      {/* User Account */}
      <div className="relative">
        <Link href={session ? "/dashboard" : "/signin"}>
          <motion.div
            className="group relative p-3 rounded-full hover:bg-[#D4AF37]/10 transition-all duration-300 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <User
              size={22}
              strokeWidth={1.5}
              className="text-white group-hover:text-[#D4AF37] transition-colors duration-300"
            />
            <div className="absolute inset-0 rounded-full bg-[#D4AF37]/20 scale-0 group-hover:scale-100 transition-transform duration-300" />
          </motion.div>
        </Link>
        {/* User Dropdown Menu */}
      </div>

      {/* Wishlist */}
      <Link href="/wishlist">
        <motion.div
          className="group relative p-3 rounded-full hover:bg-[#D4AF37]/10 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Heart
            size={22}
            strokeWidth={1.5}
            className="text-white group-hover:text-[#D4AF37] transition-colors duration-300"
          />
          <div className="absolute inset-0 rounded-full bg-[#D4AF37]/20 scale-0 group-hover:scale-100 transition-transform duration-300" />

          {/* Wishlist Count Badge */}
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-[#E74C3C] to-[#C0392B] rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">3</span>
          </div>
        </motion.div>
      </Link>

      {/* Shopping Bag */}
      <Link href="/cart">
        <motion.div
          className="group relative p-3 rounded-full hover:bg-[#D4AF37]/10 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ShoppingBag
            size={22}
            strokeWidth={1.5}
            className="text-white group-hover:text-[#D4AF37] transition-colors duration-300"
          />
          <div className="absolute inset-0 rounded-full bg-[#D4AF37]/20 scale-0 group-hover:scale-100 transition-transform duration-300" />

          {/* Cart Count Badge */}
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] rounded-full flex items-center justify-center">
            <span className="text-black text-xs font-bold">2</span>
          </div>
        </motion.div>
      </Link>

      {/* VIP Indicator */}
    </div>
  );
}
