"use client";

import { usePathname } from "next/navigation";
import React, { useState } from "react";
import Link from "next/link";
import Filterfromnavbar from "./filterfromnavbar";
import Searchbar from "./search";
import Rightsection from "./rightsection";
import { Menu, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const path = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const hideNavbar =
    path === "/signin" || path === "/signup" || path.startsWith("/admin");

  if (hideNavbar) return null;

  return (
    <>
      {/* Main Navbar */}
      <motion.nav
        className="h-[80px] sticky top-0 bg-gradient-to-r from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A] backdrop-blur-md border-b border-[#D4AF37]/20 w-full text-white z-50 flex items-center px-8 shadow-2xl"
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Left Section - Menu Button */}
        <div className="flex items-center min-w-[200px]">
          <motion.button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="group relative p-3 rounded-full hover:bg-[#D4AF37]/10 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Menu
              size={24}
              className="text-white group-hover:text-[#D4AF37] transition-colors duration-300"
              onClick={() => setIsMenuOpen(true)}
            />
            <div className="absolute inset-0 rounded-full bg-[#D4AF37]/20 scale-0 group-hover:scale-100 transition-transform duration-300" />
          </motion.button>

          {/* Search Icon */}
          <motion.button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="group relative p-3 ml-4 rounded-full hover:bg-[#D4AF37]/10 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Search
              size={22}
              className="text-white group-hover:text-[#D4AF37] transition-colors duration-300"
            />
            <div className="absolute inset-0 rounded-full bg-[#D4AF37]/20 scale-0 group-hover:scale-100 transition-transform duration-300" />
          </motion.button>
        </div>

        {/* Center - Logo */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Link href="/" className="group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <img
                src="/xavique.png"
                alt="Xavique Logo"
                className="h-[50px] object-contain filter brightness-110 group-hover:brightness-125 transition-all duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/0 via-[#D4AF37]/10 to-[#D4AF37]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
            </motion.div>
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center ml-auto min-w-[200px] justify-end">
          <Rightsection />
        </div>
      </motion.nav>

      {/* Filter Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <AnimatePresence>
            <>
              {/* <motion.div
                key="backdrop"
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMenuOpen(false)}
              />

              <motion.div
                key="menu-panel"
                className="fixed top-[80px] left-0 w-full bg-gradient-to-b from-[#0A0A0A] to-[#1A1A1A] border-b border-[#D4AF37]/30 z-50 shadow-2xl"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              > */}
                {/* <div className="px-8 py-6"> */}
                  <Filterfromnavbar
                    isOpen={isMenuOpen}
                    onClose={() => setIsMenuOpen(false)}
                  />
                {/* </div> */}
              {/* </motion.div> */}
            </>
          </AnimatePresence>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && <Searchbar onClose={() => setIsSearchOpen(false)} />}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
