"use client";

import { usePathname } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import FullScreenCategoryMenu from "./filterfromnavbar";
import Searchbar from "./search";
import Rightsection from "./rightsection";
import { Menu, Search, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import FilterSidebar from "@/components/filter/filter";

const Navbar = () => {
  const path = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);

  const lastScrollY = useRef(0);

  const controlNavbar = () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
      setShowNavbar(false); // scrolling down
    } else {
      setShowNavbar(true); // scrolling up
    }
    lastScrollY.current = currentScrollY;
  };

  useEffect(() => {
    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, []);

  const hideNavbar =
    path === "/signin" || path === "/signup" || path.startsWith("/admin");

  if (hideNavbar) return null;

  return (
    <>
      <motion.nav
        initial={{ y: 0 }}
        animate={{ y: showNavbar ? 0 : -80 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="h-[80px] flex flex-col fixed top-0 bg-gradient-to-r from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A] backdrop-blur-md border-b border-[#D4AF37]/20 w-full text-white z-50 px-4 md:px-8 shadow-2xl"
      >
        <div className="flex items-center justify-between w-full h-full">
          {/* Left: Menu, Search, Filter */}
          <div className="flex items-center w-1/3 md:min-w-[200px]">
            {/* Menu */}
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="group relative p-2 md:p-3 rounded-full hover:bg-[#D4AF37]/10 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Menu
                size={24}
                className="text-white group-hover:text-[#D4AF37] transition-colors duration-300"
              />
            </motion.button>

            {/* Search */}
            <motion.button
              onClick={() => setIsSearchOpen(true)}
              className="group relative p-2 ml-2 md:ml-4 rounded-full hover:bg-[#D4AF37]/10 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Search
                size={22}
                className="text-white group-hover:text-[#D4AF37] transition-colors duration-300"
              />
            </motion.button>

            {/* Filter */}
            <motion.button
              onClick={() => setIsFilterOpen(true)}
              className="group relative p-2 ml-2 rounded-full hover:bg-[#D4AF37]/10 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Filter
                size={20}
                className="text-white group-hover:text-[#D4AF37] transition-colors duration-300"
              />
            </motion.button>
          </div>

          {/* Center: Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-[100px] md:w-auto">
            <Link href="/" className="group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <img
                  src="/xavique.png"
                  alt="Xavique Logo"
                  className="h-[40px] md:h-[50px] object-contain filter brightness-110 group-hover:brightness-125 transition-all duration-300"
                />
              </motion.div>
            </Link>
          </div>

          {/* Right: Auth/Profile */}
          <div className="flex items-center ml-auto w-1/3 md:min-w-[200px] justify-end">
            <Rightsection />
          </div>
        </div>
      </motion.nav>

      {/* Filter Sidebar */}
      <FilterSidebar isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />

      {/* Fullscreen Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <FullScreenCategoryMenu onClose={() => setIsMenuOpen(false)} />
        )}
      </AnimatePresence>

      {/* Search Bar */}
      <AnimatePresence>
        {isSearchOpen && <Searchbar onClose={() => setIsSearchOpen(false)} />}
      </AnimatePresence>
    </>
  );
};

export default Navbar;


// "use client";

// import { usePathname } from "next/navigation";
// import React, { useState, useEffect, useRef } from "react";
// import Link from "next/link";
// import FullScreenCategoryMenu from "./filterfromnavbar";
// import Searchbar from "./search";
// import Rightsection from "./rightsection";
// import { Menu, Search } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import FilterSidebar from "@/components/filter/filter";

// const Navbar = () => {
//   const path = usePathname();
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isSearchOpen, setIsSearchOpen] = useState(false);
//   const [showNavbar, setShowNavbar] = useState(true);

//   const lastScrollY = useRef(0);

//   const controlNavbar = () => {
//     const currentScrollY = window.scrollY;
//     if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
//       setShowNavbar(false); // scroll down
//     } else {
//       setShowNavbar(true); // scroll up
//     }
//     lastScrollY.current = currentScrollY;
//   };

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       window.addEventListener("scroll", controlNavbar);
//       return () => window.removeEventListener("scroll", controlNavbar);
//     }
//   }, []);

//   const hideNavbar =
//     path === "/signin" || path === "/signup" || path.startsWith("/admin");

//   if (hideNavbar) return null;

//   return (
//     <>
//       <motion.nav
//         initial={{ y: 0 }}
//         animate={{ y: showNavbar ? 0 : -80 }}
//         transition={{ duration: 0.4, ease: "easeInOut" }}
//         className="h-[80px] flex flex-col fixed top-0 bg-gradient-to-r from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A] backdrop-blur-md border-b border-[#D4AF37]/20 w-full text-white z-50 px-4 md:px-8 shadow-2xl"
//       >
//         {/* Top Row with 3 sections */}
//         <div className="flex items-center justify-between w-full h-full">
//           {/* Left: Menu & Search */}
//           <div className="flex items-center w-1/3 md:min-w-[200px]">
//             <motion.button
//               onClick={() => setIsMenuOpen(!isMenuOpen)}
//               className="group relative p-2 md:p-3 rounded-full hover:bg-[#D4AF37]/10 transition-all duration-300"
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//             >
//               <Menu
//                 size={24}
//                 className="text-white md:w-[24px] md:h-[24px] h-[20px] w-[20px] group-hover:text-[#D4AF37] transition-colors duration-300"
//               />
//               <div className="absolute inset-0 rounded-full bg-[#D4AF37]/20 scale-0 group-hover:scale-100 transition-transform duration-300" />
//             </motion.button>

//             <motion.button
//               onClick={() => setIsSearchOpen(true)}
//               className="group relative p-2 ml-2 md:ml-4 rounded-full hover:bg-[#D4AF37]/10 transition-all duration-300"
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//             >
//               <Search
//                 size={22}
//                 className="text-white md:w-[22px] md:h-[22px] h-[18px] w-[18px] group-hover:text-[#D4AF37] transition-colors duration-300"
//               />
//               <div className="absolute inset-0 rounded-full bg-[#D4AF37]/20 scale-0 group-hover:scale-100 transition-transform duration-300" />
//             </motion.button>
//           </div>

//           {/* Center: Logo */}
//           <div className="absolute left-1/2 transform -translate-x-1/2 w-[100px] md:w-auto">
//             <Link href="/" className="group">
//               <motion.div
//                 whileHover={{ scale: 1.05 }}
//                 transition={{ duration: 0.2 }}
//                 className="relative"
//               >
//                 <img
//                   src="/xavique.png"
//                   alt="Xavique Logo"
//                   className="h-[40px] md:h-[50px] object-contain filter brightness-110 group-hover:brightness-125 transition-all duration-300"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/0 via-[#D4AF37]/10 to-[#D4AF37]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
//               </motion.div>
//             </Link>
//           </div>

//           {/* Right: Auth / Profile Section */}
//           <div className="flex items-center ml-auto w-1/3 md:min-w-[200px] justify-end">
//             <Rightsection />
//           </div>
//         </div>

//         {/* Optional Filter */}
//         <div>
//           <FilterSidebar />
//         </div>
//       </motion.nav>

//       <AnimatePresence>
//         {isMenuOpen && (
//           <FullScreenCategoryMenu onClose={() => setIsMenuOpen(false)} />
//         )}
//       </AnimatePresence>

//       <AnimatePresence>
//         {isSearchOpen && <Searchbar onClose={() => setIsSearchOpen(false)} />}
//       </AnimatePresence>
//     </>
//   );
// };

// export default Navbar;
