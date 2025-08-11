"use client";
import React, { useState, useEffect } from "react";
import { X, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ThemedFilter() {
  const [isOpen, setIsOpen] = useState(false);
  const [price, setPrice] = useState(50);
  const [activeCollection, setActiveCollection] = useState(0);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div className="relative">
      {/* Navbar */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-[#222] bg-[#0A0A0A]">
        {/* Collections */}
        <div className="flex gap-4">
          {["New Arrivals", "Best Sellers", "Premium Collection"].map((col, idx) => (
            <button
              key={idx}
              onClick={() => setActiveCollection(idx)}
              className={`text-sm font-medium transition-colors ${
                activeCollection === idx
                  ? "text-[#D4AF37] border-b border-[#D4AF37]"
                  : "text-[#999] hover:text-[#D4AF37]"
              }`}
            >
              {col}
            </button>
          ))}
        </div>

        {/* Filter Button */}
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded border border-[#333] bg-[#111] hover:border-[#D4AF37] group transition-all"
        >
          <Filter className="w-4 h-4 text-[#999] group-hover:text-[#D4AF37]" />
          <span className="text-sm text-[#eee] group-hover:text-[#D4AF37]">Filter</span>
        </button>
      </div>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 w-screen h-screen bg-[#0A0A0A] z-[1000]"
            onClick={() => setIsOpen(false)}
          ></motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed top-0 right-0 h-screen w-[340px] bg-[#111] text-white shadow-xl z-[1001] flex flex-col border-l border-[#222]"
          >
            {/* Header */}
            <div className="flex justify-between items-center px-5 py-4 border-b border-[#333]">
              <h2 className="text-lg font-semibold text-[#D4AF37]">Filter Products</h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-[#999] hover:text-[#D4AF37] transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 space-y-7 flex-1 overflow-y-auto">
              {/* Category */}
              <motion.div
                whileHover={{ borderColor: "#D4AF37" }}
                className="p-4 rounded-lg border border-[#333] bg-[#0A0A0A] transition-colors"
              >
                <label className="block text-sm font-medium mb-2 text-[#D4AF37]">Category</label>
                <select className="w-full border border-[#333] rounded p-3 bg-[#0A0A0A] text-[#eee] text-sm focus:outline-none focus:border-[#D4AF37] transition-colors">
                  <option className="bg-[#0A0A0A] text-[#eee]">All Categories</option>
                  <option className="bg-[#0A0A0A] text-[#eee]">Footwear</option>
                  <option className="bg-[#0A0A0A] text-[#eee]">Apparel</option>
                  <option className="bg-[#0A0A0A] text-[#eee]">Accessories</option>
                  <option className="bg-[#0A0A0A] text-[#eee]">Limited Edition</option>
                </select>
              </motion.div>

              {/* Price Range */}
              <motion.div
                whileHover={{ borderColor: "#D4AF37" }}
                className="p-4 rounded-lg border border-[#333] bg-[#0A0A0A] transition-colors"
              >
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-[#D4AF37]">Price Range</label>
                  <span className="text-sm font-medium bg-[#D4AF37] text-[#0A0A0A] px-2 py-1 rounded">
                    ${price}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="500"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full h-1.5 accent-[#D4AF37] cursor-pointer"
                />
                <div className="flex justify-between text-xs text-[#999] mt-1">
                  <span>$0</span>
                  <span>$500</span>
                </div>
              </motion.div>

              {/* Sort By */}
              <motion.div
                whileHover={{ borderColor: "#D4AF37" }}
                className="p-4 rounded-lg border border-[#333] bg-[#0A0A0A] transition-colors"
              >
                <label className="block text-sm font-medium mb-2 text-[#D4AF37]">Sort By</label>
                <select className="w-full border border-[#333] rounded p-3 bg-[#0A0A0A] text-[#eee] text-sm focus:outline-none focus:border-[#D4AF37] transition-colors">
                  <option className="bg-[#0A0A0A] text-[#eee]">Recommended</option>
                  <option className="bg-[#0A0A0A] text-[#eee]">Newest First</option>
                  <option className="bg-[#0A0A0A] text-[#eee]">Price: Low to High</option>
                  <option className="bg-[#0A0A0A] text-[#eee]">Price: High to Low</option>
                </select>
              </motion.div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-between p-5 border-t border-[#333]">
              <button
                onClick={() => {
                  setPrice(250);
                  setIsOpen(false);
                }}
                className="px-5 py-2.5 rounded border border-[#333] text-[#999] hover:text-[#D4AF37] hover:border-[#D4AF37] transition-colors"
              >
                Reset
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="px-5 py-2.5 rounded bg-[#D4AF37] text-[#0A0A0A] font-medium hover:bg-[#c5a030] transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}