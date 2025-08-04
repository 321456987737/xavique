"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    label: "Men",
    subcategories: ["Shoes", "Jewelry", "Accessories", "Watches"],
  },
  {
    label: "Women",
    subcategories: ["Bags", "Shoes", "Jewelry", "Dresses"],
  },
  {
    label: "Collections",
    subcategories: ["Exclusive", "Limited Edition", "New Arrivals"],
  },
  {
    label: "Accessories",
    subcategories: ["Sunglasses", "Belts", "Wallets"],
  },
];

export default function FullScreenCategoryMenu() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isOpen, setIsOpen] = useState(true);
  const [exitDirection, setExitDirection] = useState(1);

  const handleCategoryChange = (category) => {
    if (selectedCategory) {
      const currentIndex = categories.findIndex(
        (c) => c.label === selectedCategory.label
      );
      const newIndex = categories.findIndex((c) => c.label === category.label);
      setExitDirection(newIndex > currentIndex ? 1 : -1);
    }
    setSelectedCategory(category);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Background overlay */}
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsOpen(false)}
      />

      {/* Main Menu */}
      <div className="fixed inset-0 z-[100] flex w-screen h-screen text-white">
        {/* Left Panel - Categories */}
        <div className="w-[250px] bg-[#0A0A0A] border-r border-[#D4AF37]/20 p-6 flex flex-col gap-4">
          {/* Logo & Close Button */}
          <div className="flex items-center justify-between mb-6">
            <div className="text-2xl font-bold tracking-widest text-[#D4AF37]">
              <Link href={"/"}>
              <img src="/xavique.png" alt="Logo" className="w-24 cursor-pointer" />
              </Link>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-[#D4AF37] transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Category List */}
          <h2 className="text-lg font-semibold text-[#D4AF37]">Categories</h2>
          <div className="flex flex-col gap-2">
            {categories.map((cat, index) => (
              <button
                key={index}
                onClick={() => handleCategoryChange(cat)}
                className={`w-full text-left flex items-center justify-between gap-2 px-3 py-2 rounded-lg hover:bg-[#D4AF37]/10 transition ${
                  selectedCategory?.label === cat.label
                    ? "bg-[#1A1A1A] text-[#D4AF37]"
                    : ""
                }`}
              >
                <span className="text-sm font-medium">{cat.label}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Panel - Subcategories */}
        <AnimatePresence mode="wait">
          {selectedCategory && (
            <motion.div
              key={selectedCategory.label}
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100 * exitDirection, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
                mass: 0.5,
              }}
              className="w-[300px] bg-[#1A1A1A] p-6"
            >
              <h3 className="text-xl font-semibold text-[#D4AF37] mb-6">
                {selectedCategory.label}
              </h3>
              <ul className="space-y-3">
                {selectedCategory.subcategories.map((sub, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    className="text-sm px-4 py-2 rounded hover:bg-[#D4AF37]/10 transition cursor-pointer"
                  >
                    {sub}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
