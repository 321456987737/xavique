"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, X } from "lucide-react";
import Link from "next/link";

const categories = [
  { label: "Men", subcategories: ["Shoes", "Jewelry", "Accessories", "Watches"] },
  { label: "Women", subcategories: ["Bags", "Shoes", "Jewelry", "Dresses"] },
  { label: "Collections", subcategories: ["Exclusive", "Limited Edition", "New Arrivals"] },
  { label: "Accessories", subcategories: ["Sunglasses", "Belts", "Wallets"] },
];

export default function FullScreenCategoryMenu({ onClose }) {
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const escHandler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", escHandler);
    return () => window.removeEventListener("keydown", escHandler);
  }, [onClose]);

  return (
    <AnimatePresence mode="wait">
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed inset-0 z-[98] bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* ---- MOBILE / TABLET ---- */}
      <motion.div
        key="mobile-tablet"
        className="fixed inset-0 z-[99] block md:hidden"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        onClick={onClose}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="h-[90%] bg-[#0A0A0A] rounded-t-2xl flex flex-col overflow-hidden"
        >
          <div className="flex justify-between items-center px-6 py-4 border-b border-[#D4AF37]/20">
            <Link href="/">
              <img src="/xavique.png" alt="Logo" className="h-8" />
            </Link>
            <button onClick={onClose}>
              <X className="w-6 h-6 text-[#D4AF37]" />
            </button>
          </div>

          <div className="p-6 flex-1 overflow-y-auto">
            {!selectedCategory ? (
              <motion.div
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.05,
                      delayChildren: 0.1,
                    },
                  },
                }}
                initial="hidden"
                animate="visible"
                className="space-y-3"
              >
                <h2 className="text-lg font-semibold text-[#D4AF37] mb-4">Categories</h2>
                {categories.map((cat) => (
                  <motion.button
                    key={cat.label}
                    variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }}
                    onClick={() => setSelectedCategory(cat)}
                    whileTap={{ scale: 0.97 }}
                    className="w-full flex justify-between items-center px-4 py-3 rounded-lg bg-[#1A1A1A] hover:bg-[#D4AF37]/10 transition text-white"
                  >
                    <span>{cat.label}</span>
                    <ChevronRight />
                  </motion.button>
                ))}
              </motion.div>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <button onClick={() => setSelectedCategory(null)} className="text-[#D4AF37]">
                    <ChevronLeft />
                  </button>
                  <h2 className="text-lg font-semibold text-[#D4AF37]">{selectedCategory.label}</h2>
                </div>
                <motion.div
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.05,
                        delayChildren: 0.1,
                      },
                    },
                  }}
                  initial="hidden"
                  animate="visible"
                  className="space-y-3"
                >
                  {selectedCategory.subcategories.map((sub, i) => (
                    <motion.div
                      key={i}
                      variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }}
                      whileTap={{ scale: 0.97 }}
                      className="px-4 py-3 rounded-lg bg-[#1A1A1A] hover:bg-[#D4AF37]/10 transition text-white cursor-pointer"
                    >
                      {sub}
                    </motion.div>
                  ))}
                </motion.div>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* ---- DESKTOP ---- */}
      <motion.div
        key="desktop"
        className="fixed inset-0 z-[99] hidden md:flex items-start justify-start"
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        onClick={onClose}
      >
        <div
          className="flex h-screen bg-[#0A0A0A]/95 backdrop-blur-lg text-white"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-[280px] border-r border-[#D4AF37]/20 p-6">
            <div className="flex justify-between items-center mb-6">
              <Link href="/">
                <img src="/xavique.png" alt="Logo" className="w-24" />
              </Link>
              <button
                onClick={onClose}
                className="text-[#D4AF37] hover:text-white transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <h2 className="text-xl font-semibold text-[#D4AF37] mb-4">Categories</h2>
            <div className="space-y-3">
              {categories.map((cat) => (
                <button
                  key={cat.label}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition ${
                    selectedCategory?.label === cat.label
                      ? "bg-[#D4AF37]/10 text-[#D4AF37]"
                      : "hover:bg-[#D4AF37]/5 text-white"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {selectedCategory && (
            <motion.div
              key={selectedCategory.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-[280px] bg-[#1A1A1A] p-6"
            >
              <h3 className="text-xl font-semibold text-[#D4AF37] mb-6">
                {selectedCategory.label}
              </h3>
              <motion.div
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.05 },
                  },
                }}
                initial="hidden"
                animate="visible"
                className="space-y-3"
              >
                {selectedCategory.subcategories.map((sub, i) => (
                  <motion.div
                    key={i}
                    variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }}
                    className="text-white px-4 py-2 rounded-lg hover:bg-[#D4AF37]/10 cursor-pointer transition"
                  >
                    {sub}
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}


// "use client";

// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { ChevronRight, X } from "lucide-react";
// import Link from "next/link";

// const menuVariants = {
//   hidden: {
//     x: "-100%",
//     opacity: 0
//   },
//   visible: {
//     x: 0,
//     opacity: 1,
//     transition: {
//       type: "spring",
//       damping: 30,
//       stiffness: 300,
//       when: "beforeChildren"
//     }
//   },
//   exit: {
//     x: "-100%",
//     opacity: 0,
//     transition: {
//       type: "spring",
//       damping: 30,
//       stiffness: 300,
//       when: "afterChildren"
//     }
//   }
// };


// const categories = [
//   {
//     label: "Men",
//     subcategories: ["Shoes", "Jewelry", "Accessories", "Watches"],
//   },
//   {
//     label: "Women",
//     subcategories: ["Bags", "Shoes", "Jewelry", "Dresses"],
//   },
//   {
//     label: "Collections",
//     subcategories: ["Exclusive", "Limited Edition", "New Arrivals"],
//   },
//   {
//     label: "Accessories",
//     subcategories: ["Sunglasses", "Belts", "Wallets"],
//   },
// ];
// const itemVariants = {
//   hidden: { opacity: 0, x: -20 },
//   visible: (i) => ({
//     opacity: 1,
//     x: 0,
//     transition: {
//       delay: i * 0.1,
//       type: "spring",
//       damping: 25,
//       stiffness: 200
//     }
//   }),
//   exit: { 
//     opacity: 0,
//     x: -20,
//     transition: {
//       duration: 0.2
//     }
//   }
// };

// export default function FullScreenCategoryMenu({ onClose }) {
//   const [selectedCategory, setSelectedCategory] = useState(null);

//   // Handle escape key
//   useEffect(() => {
//     const handleEsc = (e) => e.key === "Escape" && onClose();
//     window.addEventListener("keydown", handleEsc);
//     return () => window.removeEventListener("keydown", handleEsc);
//   }, [onClose]);

//   // Stop propagation on menu click
//   const handleMenuClick = (e) => {
//     e.stopPropagation();
//   };

//   return (
//     <AnimatePresence mode="wait">
//       <div className="fixed inset-0 z-[99] flex items-center justify-start" onClick={onClose}>
//         {/* Backdrop */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           transition={{ duration: 0.3 }}
//           className="absolute inset-0 bg-black/60 backdrop-blur-sm"
//         />

//         {/* Menu Container */}
//         <motion.div
//           variants={menuVariants}
//           initial="hidden"
//           animate="visible"
//           exit="exit"
//           onClick={handleMenuClick}
//           className="relative z-[100] flex h-screen"
//         >
//           {/* Categories Panel */}
//           <div className="w-[280px] bg-[#0A0A0A] border-r border-[#D4AF37]/20 h-full">
//             <div className="p-6 flex flex-col h-full">
//               <div className="flex items-center justify-between mb-8">
//                 <Link href="/">
//                   <img src="/xavique.png" alt="Logo" className="w-28 h-auto" />
//                 </Link>
//                 <button
//                   onClick={onClose}
//                   className="p-2 hover:bg-[#D4AF37]/10 rounded-full transition-colors"
//                 >
//                   <X className="w-6 h-6 text-[#D4AF37]" />
//                 </button>
//               </div>

//               <h2 className="text-xl font-semibold text-[#D4AF37] mb-6">
//                 Categories
//               </h2>

//               <div className="space-y-2">
//                 {categories.map((cat, index) => (
//                   <motion.button
//                     key={cat.label}
//                     variants={itemVariants}
//                     custom={index}
//                     whileHover={{ x: 4 }}
//                     onClick={() => setSelectedCategory(cat)}
//                     className={`w-full text-left flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-300 ${
//                       selectedCategory?.label === cat.label
//                         ? "bg-[#D4AF37]/10 text-[#D4AF37]"
//                         : "hover:bg-[#D4AF37]/5 text-white"
//                     }`}
//                   >
//                     <span className="font-medium">{cat.label}</span>
//                     <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${
//                       selectedCategory?.label === cat.label ? "text-[#D4AF37]" : ""
//                     }`} />
//                   </motion.button>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Subcategories Panel */}
//           <AnimatePresence mode="wait">
//             {selectedCategory && (
//               <motion.div
//                 key={selectedCategory.label}
//                 initial={{ x: -20, opacity: 0 }}
//                 animate={{ x: 0, opacity: 1 }}
//                 exit={{ x: -20, opacity: 0 }}
//                 transition={{ type: "spring", damping: 25, stiffness: 200 }}
//                 className="w-[280px] bg-[#1A1A1A] h-full"
//               >
//                 <div className="p-6">
//                   <h3 className="text-xl font-semibold text-[#D4AF37] mb-6">
//                     {selectedCategory.label}
//                   </h3>
//                   <div className="space-y-2">
//                     {selectedCategory.subcategories.map((sub, i) => (
//                       <motion.div
//                         key={i}
//                         variants={itemVariants}
//                         custom={i}
//                         initial="hidden"
//                         animate="visible"
//                         exit="exit"
//                         whileHover={{ x: 4 }}
//                         className="text-white hover:text-[#D4AF37] px-4 py-3 rounded-lg hover:bg-[#D4AF37]/5 transition-all duration-300 cursor-pointer"
//                       >
//                         {sub}
//                       </motion.div>
//                     ))}
//                   </div>
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </motion.div>
//       </div>
//     </AnimatePresence>
//   );
// }