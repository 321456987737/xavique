"use client";
import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

const FilterSidebar = ({ isOpen, onClose }) => {
  const sidebarRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <div className={`fixed h-[350px] inset-0 z-50 ${isOpen ? "" : "pointer-events-none"}`}>
      <div
        className={`fixed inset-0 bg-[#0A0A0A]/60 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        ref={sidebarRef}
        className={`fixed top-0 right-0 h-full w-[320px] bg-[#F6F5F3] shadow-xl transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex justify-between items-center px-5 py-4 border-b border-[#D4AF37] bg-[#0A0A0A] text-[#D4AF37]">
          <h2 className="text-lg font-semibold">Filters</h2>
          <button onClick={onClose} aria-label="Close sidebar">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-6 text-[#0A0A0A]">
          <div>
            <label className="block text-sm text-[#5A1A17] font-medium mb-1">Category</label>
            <select className="w-full border border-[#D4AF37] rounded p-2 bg-[#F6F5F3] text-sm focus:outline-none">
              <option>All</option>
              <option>Shoes</option>
              <option>Clothing</option>
              <option>Accessories</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-[#5A1A17] font-medium mb-1">Price Range</label>
            <input
              type="range"
              min="0"
              max="100"
              className="w-full accent-[#D4AF37] cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm text-[#5A1A17] font-medium mb-1">Sort By</label>
            <select className="w-full border border-[#D4AF37] rounded p-2 bg-[#F6F5F3] text-sm focus:outline-none">
              <option>Newest</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>

          <div className="flex justify-between pt-4 border-t border-[#D4AF37]">
            <button
              onClick={onClose}
              className="text-sm px-4 py-2 rounded border border-[#5A1A17] text-[#5A1A17] hover:bg-[#5A1A17] hover:text-white transition"
            >
              Clear
            </button>
            <button
              onClick={onClose}
              className="text-sm px-4 py-2 rounded bg-[#D4AF37] text-[#0A0A0A] hover:bg-[#5A1A17] hover:text-white transition"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
