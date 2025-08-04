"use client";
import React, { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Searchbar({ onClose }) {
  const [query, setQuery] = useState("");
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        onClose?.();
      }
    }
    function handleKeyDown(e) {
      if (e.key === "Escape") onClose?.();
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      console.log("Searching for:", query);
      onClose?.();
    }
  };

  return (
    <AnimatePresence>
      <>
        {/* Background Overlay */}
        <motion.div
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Search Bar */}
        <motion.div
          ref={wrapperRef}
          className="fixed top-[15%] left-1/2 -translate-x-1/2 z-50 w-[95vw] max-w-3xl"
          initial={{ opacity: 0, scale: 0.95, y: -40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -40 }}
          transition={{ duration: 0.4 }}
        >
          <form onSubmit={handleSubmit}>
            <div className="relative flex items-center  bg-gradient-to-r from-[#0a0a0a] to-[#1A1A1A] border border-[#D4AF37]/40 rounded-2xl shadow-2xl shadow-[#D4AF37]" style={{ boxShadow: "0 0 15px #D4AF37" }}>
              <div className="pl-6">
                <Search className="text-[#D4AF37]" size={22} />
              </div>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search luxury..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full p-5 bg-transparent text-white text-lg outline-none placeholder-gray-400"
              />
              <button
                type="button"
                onClick={onClose}
                className="bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-black p-4 m-2 rounded-xl hover:shadow-lg transition-all duration-300"
              >
                <X size={20} />
              </button>
            </div>
          </form>
        </motion.div>
      </>
    </AnimatePresence>
  );
}
