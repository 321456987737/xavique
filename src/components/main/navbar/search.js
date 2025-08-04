"use client";
import React, { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Searchbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-focus when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Close when clicking outside or Escape
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(e) {
      if (e.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      console.log("Searching for:", query);
      // Your search logic
    }
  };

  return (
    <>
      {/* Initial button (when closed) */}
      {!isOpen && (
        <button onClick={() => setIsOpen(true)}>
          <div className="flex items-center justify-center  gap-2 bg-[#0A0A0A] border border-white h-[40px] hover:text-[#D4AF37] hover:border-[#D4AF37] text-white px-3 rounded-full hover:scale-101 transition">
            <input
              type="text"
              placeholder="Search Here"
              className="bg-transparent flex items-center justify-center outline-none pl-3  hover:placeholder:text-[#D4AF37] h-[40px] placeholder:text-gray-400  text-white rounded-full "
            />
            <Search size={20} />
          </div>
        </button>
      )}

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Dark overlay */}
            <motion.div
              className="fixed inset-0 bg-black z-40 "
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />

            {/* Floating Search Wrapper */}
            <motion.div
              ref={wrapperRef}
              className="fixed top-[12%] left-1/2 -translate-x-1/2 z-50 w-[90vw] max-w-xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <form onSubmit={handleSubmit}>
                <div className="flex items-center bg-[#0A0A0A] border border-[#D4AF37] rounded-full overflow-hidden">
                  <div className="pl-4">
                    <Search className="text-[#D4AF37]" size={20} />
                  </div>
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search for anything..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full p-4 bg-transparent text-white outline-none placeholder-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      setIsOpen(false);
                    }}
                    className="bg-[#D4AF37] text-white p-3 rounded-full m-1"
                  >
                    <X />
                  </button>
                </div>
              </form>

              {/* Suggestions */}
              {query && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-2 bg-[#1A1A1A] rounded-lg shadow-xl overflow-hidden"
                >
                  <div className="p-2 text-white hover:bg-[#D4AF37]/10 cursor-pointer">
                    {query} in Products
                  </div>
                  <div className="p-2 text-white hover:bg-[#D4AF37]/10 cursor-pointer">
                    {query} in Blog
                  </div>
                  <div className="p-2 text-white hover:bg-[#D4AF37]/10 cursor-pointer">
                    Search for {query}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
