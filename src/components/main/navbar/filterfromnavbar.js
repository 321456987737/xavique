"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { ChevronRight, ChevronLeft, X, Menu } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Categories data
const categories = [
  {
    label: "Gifts and Personalization",
    subcategories: [
      {
        label: "Custom Engraving",
        subsubcategories: ["Leather Goods", "Jewelry", "Watches"],
      },
      {
        label: "Monogramming",
        subsubcategories: ["Handbags", "Wallets", "Travel Bags"],
      },
      { label: "Gift Wrapping" },
      { label: "Special Editions" },
    ],
  },
  {
    label: "New",
    subcategories: [
      { label: "Latest Releases" },
      { label: "Trending Now" },
      {
        label: "Seasonal Picks",
        subsubcategories: [
          "Spring Collection",
          "Summer Collection",
          "Winter Collection",
        ],
      },
      { label: "Editor's Choice" },
    ],
  },
  {
    label: "Bags and Small Leather Goods",
    subcategories: [
      { label: "Tote Bags" },
      { label: "Crossbody Bags" },
      {
        label: "Wallets & Cardholders",
        subsubcategories: ["Bi-Fold", "Tri-Fold", "Card Holders"],
      },
    ],
  },
  {
    label: "Women",
    subcategories: [
      { label: "Dresses" },
      { label: "Shoes" },
      {
        label: "Jewelry",
        subsubcategories: ["Necklaces", "Bracelets", "Earrings", "Rings"],
      },
      { label: "Handbags" },
    ],
  },
  {
    label: "Men",
    subcategories: [
      { label: "Shoes" },
      {
        label: "Watches",
        subsubcategories: ["Luxury", "Sport", "Classic"],
      },
      { label: "Jackets" },
      { label: "Belts" },
    ],
  },
  {
    label: "Jewelry",
    subcategories: [
      {
        label: "Necklaces",
        subsubcategories: ["Gold", "Platinum", "Diamond"],
      },
      { label: "Bracelets" },
      { label: "Rings" },
      { label: "Earrings" },
    ],
  },
  {
    label: "Watches",
    subcategories: [
      { label: "Luxury Watches" },
      { label: "Sport Watches" },
      {
        label: "Classic Watches",
        subsubcategories: ["Automatic", "Quartz", "Skeleton"],
      },
    ],
  },
  {
    label: "Perfumes",
    subcategories: [
      { label: "Women's Perfumes" },
      { label: "Men's Perfumes" },
      { label: "Unisex Fragrances" },
      {
        label: "Gift Sets",
        subsubcategories: ["Mini Sets", "Exclusive Sets"],
      },
    ],
  },
  {
    label: "Trunks, Travel and Home",
    subcategories: [
      { label: "Travel Bags" },
      { label: "Luggage" },
      { label: "Decor" },
    ],
  },
  {
    label: "Services",
    subcategories: [
      { label: "Repairs" },
      { label: "Care & Maintenance" },
      { label: "Consultations" },
      { label: "Personal Shopping" },
    ],
  },
  {
    label: "The Maison Louis Vuitton",
    subcategories: [
      { label: "Heritage" },
      { label: "Art Exhibitions" },
      { label: "Collaborations" },
      { label: "Sustainability" },
    ],
  },
];

// Helper function to generate URL slugs
const generateSlug = (text) => {
  return text
    .replace(/&/g, 'and')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

// Helper function to generate collection URLs
const generateCollectionUrl = (category, subcategory = null, subsubcategory = null) => {
  const categorySlug = generateSlug(category);
    console.log(categorySlug,subcategory,subsubcategory)
  if (subsubcategory) {
  const subcategorySlug = generateSlug(subcategory);
  const subsubcategorySlug = generateSlug(subsubcategory);
  return `/collection?category=${categorySlug}&subcategory=${subcategorySlug}&subsubcategory=${subsubcategorySlug}`;
} else if (subcategory) {
  const subcategorySlug = generateSlug(subcategory);
  return `/collection?category=${categorySlug}&subcategory=${subcategorySlug}`;
} else {
  return `/collection?category=${categorySlug}`;
}
}

export default function FullScreenCategoryMenu({ onClose }) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSub, setSelectedSub] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef(null);
  
  
  // Track scroll positions for back navigation
  const scrollPositions = useRef({
    category: 0,
    subcategory: 0,
    subsubcategory: 0
  });

  // Check if mobile on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const escHandler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", escHandler);
    
    // Prevent background scrolling
    document.body.style.overflow = "hidden";
    
    return () => {
      window.removeEventListener("keydown", escHandler);
      document.body.style.overflow = "auto";
    };
  }, [onClose]);

  // Handle navigation to collection pages
  const handleNavigation = (category, subcategory = null, subsubcategory = null) => {
    const url = generateCollectionUrl(category, subcategory, subsubcategory);
    router.push(url);
    onClose();
  };

  // Handle category selection with animation lock
  const handleCategorySelect = (cat) => {
    if (isAnimating) return;
    
    // If category has no subcategories, navigate directly
    if (!cat.subcategories || cat.subcategories.length === 0) {
      handleNavigation(cat.label);
      return;
    }
    
    setIsAnimating(true);
    scrollPositions.current.subcategory = 0;
    scrollPositions.current.subsubcategory = 0;
    setSelectedCategory(cat);
    setSelectedSub(null);
  };

  // Handle subcategory selection
  const handleSubcategorySelect = (sub) => {
    if (isAnimating) return;
    
    // If subcategory has no subsubcategories, navigate directly
    if (!sub.subsubcategories || sub.subsubcategories.length === 0) {
      handleNavigation(selectedCategory.label, sub.label);
      return;
    }
    
    setIsAnimating(true);
    scrollPositions.current.subsubcategory = 0;
    setSelectedSub(sub);
  };

  // import React, { useEffect, useState, useRef } from "react";
  // import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
  // import { ChevronRight, ChevronLeft, X, Menu } from "lucide-react";
  // import Link from "next/link";
  // import { useRouter } from "next/navigation";
  // Handle subsubcategory selection
  const handleSubsubcategorySelect = (item) => {
    handleNavigation(selectedCategory.label, selectedSub.label, item);
  };

  // Handle back navigation
  const handleBack = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    if (selectedSub) {
      setSelectedSub(null);
    } else if (selectedCategory) {
      setSelectedCategory(null);
    }
  };

  // Animation completion handler
  const handleAnimationComplete = () => {
    setIsAnimating(false);
  };

  // NEW: Handle "View All" for category
  const handleViewAll = () => {
    handleNavigation(selectedCategory.label);
  };

  return (
    <AnimatePresence
    //  mode="wait"
     >
      {/* Backdrop with subtle gradient */}
      <motion.div
        className="fixed inset-0 z-[99] bg-gradient-to-br from-black/50 to-[#0a0a0a]/30 backdrop-blur-md"
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        onClick={onClose}
      />

      {/* Desktop Menu */}
      {!isMobile && (
        <motion.div
        className="fixed  inset-0 z-[99]"
          ref={containerRef}
          key="desktop"
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{
            type: "spring",
            damping: 30,
            stiffness: 300,
            mass: 0.8
          }}
        >
          <div
            className="flex h-screen w-full bg-[#0A0A0A]/90 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <LayoutGroup>
              {/* Category Panel (25%) */}
              <div className="w-1/4 border-r border-[#D4AF37]/20 flex flex-col">
                {/* Header */}
                <div className="p-6 pb-4 border-b border-[#ffffff08]">
                  <div className="flex justify-between items-center mb-6">
                    <Link href="/" className="group">
                      <div className="flex items-center">
                        <span className="text-2xl font-bold tracking-wider">
                          <img src="/xavique.png" className="w-40" alt="Xavique"/>
                        </span>
                      </div>
                    </Link>
                    <button
                      onClick={onClose}
                      className="text-[#D4AF37] hover:text-white transition-all p-1.5 rounded-full hover:bg-[#D4AF37]/10"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  
                  <h2 className="text-2xl font-medium text-[#D4AF37] tracking-wide">
                    Browse Collections
                  </h2>
                  <p className="text-sm text-[#999] mt-1">
                    Explore our luxury categories
                  </p>
                </div>
                
                {/* Category List */}
                <div className="flex-grow overflow-y-auto custom-scrollbar py-4 px-2">
                  <div className="space-y-1 px-4">
                    {categories.map((cat) => (
                      <button
                        key={cat.label}
                        onClick={() => handleCategorySelect(cat)}
                        className={`w-full text-left px-4 py-3 rounded-lg text-lg transition-all duration-300 group ${
                          selectedCategory?.label === cat.label
                            ? "bg-[#D4AF37]/10 text-[#D4AF37]"
                            : "hover:bg-[#ffffff]/5 text-[#f5f5f5]"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium tracking-wide">{cat.label}</span>
                          {cat.subcategories && cat.subcategories.length > 0 ? (
                            <ChevronRight className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" />
                          ) : (
                            <div className="w-2 h-2 bg-[#D4AF37] rounded-full opacity-60" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Footer */}
                <div className="p-6 border-t border-[#ffffff08] text-center">
                  <p className="text-sm text-[#999]">
                    © 2023 Xavique Luxury Goods
                  </p>
                </div>
              </div>

              {/* Subcategory Panel (25%) */}
              <div className="w-1/4">
                <AnimatePresence mode="wait">
                  {selectedCategory && (
                    <motion.div
                      key={`sub-${selectedCategory.label}`}
                      layout
                      initial={{ opacity: 0, x: -40 }}
                      animate={{ 
                        opacity: 1, 
                        x: 0,
                        transition: { 
                          duration: 0.3,
                          ease: [0.22, 1, 0.36, 1]
                        } 
                      }}
                      exit={{ 
                        opacity: 0, 
                        x: -40,
                        transition: { 
                          duration: 0.25,
                          ease: [0.22, 1, 0.36, 1]
                        }
                      }}
                      onAnimationComplete={handleAnimationComplete}
                      className="h-full bg-[#111111] flex flex-col"
                    >
                      {/* Subcategory Header */}
                      <div className="p-6 pb-4 border-b border-[#ffffff08]">
                        <button
                          onClick={handleBack}
                          className="flex items-center group mb-6"
                        >
                          <div className="bg-[#ffffff15] p-1 rounded-full group-hover:bg-[#D4AF37]/20 transition-colors">
                            <ChevronLeft className="w-5 h-5 text-[#D4AF37]" />
                          </div>
                          <h3 className="text-xl font-medium ml-3 tracking-wide">
                            {selectedCategory.label}
                          </h3>
                        </button>
                        
                        <div className="flex items-center">
                          <div className="h-px w-8 bg-[#D4AF37] mr-2" />
                          <p className="text-sm text-[#999]">
                            {selectedCategory.subcategories.length} collections
                          </p>
                        </div>
                      </div>
                      
                      {/* Subcategory List with View All button */}
                      <div className="flex-grow overflow-y-auto custom-scrollbar py-4">
                        <div className="space-y-2 px-6">
                          {/* View All Category Button */}
                          <button
                            onClick={handleViewAll}
                            className={`w-full text-left px-4 py-3 rounded-lg text-lg transition-all duration-300 group ${
                              "hover:bg-[#ffffff]/5 text-[#f5f5f5] border border-[#ffffff10] hover:border-[#D4AF37]/30"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium tracking-wide">
                                View All {selectedCategory.label}
                              </span>
                              <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse" />
                            </div>
                          </button>

                          {selectedCategory.subcategories.map((sub, i) => (
                            <div key={i} className="relative">
                              <button
                                onClick={() => handleSubcategorySelect(sub)}
                                className={`w-full text-left px-4 py-3 rounded-lg text-lg transition-all duration-300 group ${
                                  selectedSub?.label === sub.label
                                    ? "bg-[#D4AF37]/10 text-[#D4AF37]"
                                    : "hover:bg-[#ffffff]/5 text-[#f5f5f5]"
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-medium tracking-wide">{sub.label}</span>
                                  {sub.subsubcategories && sub.subsubcategories.length > 0 ? (
                                    <ChevronRight className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                                  ) : (
                                    <div className="w-2 h-2 bg-[#D4AF37] rounded-full opacity-60" />
                                  )}
                                </div>
                              </button>
                              
                              {/* Decorative element for items with subcategories */}
                              {sub.subsubcategories && sub.subsubcategories.length > 0 && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 w-2 h-2 rounded-full bg-[#D4AF37]/30" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Sub-Subcategory Panel (50%) */}
              <div className="w-1/2 border-l border-[#ffffff08]">
                <AnimatePresence mode="wait">
                  {selectedSub && selectedSub.subsubcategories && (
                    <motion.div
                      key={`subsub-${selectedSub.label}`}
                      layout
                      initial={{ opacity: 0, x: -40 }}
                      animate={{ 
                        opacity: 1, 
                        x: 0,
                        transition: { 
                          duration: 0.3,
                          ease: [0.22, 1, 0.36, 1]
                        } 
                      }}
                      exit={{ 
                        opacity: 0, 
                        x: -40,
                        transition: { 
                          duration: 0.25,
                          ease: [0.22, 1, 0.36, 1]
                        }
                      }}
                      onAnimationComplete={handleAnimationComplete}
                      className="h-full bg-[#0A0A0A] flex flex-col"
                    >
                      {/* Sub-subcategory Header */}
                      <div className="p-6 pb-4 border-b border-[#ffffff08]">
                        <button
                          onClick={handleBack}
                          className="flex items-center group mb-6"
                        >
                          <div className="bg-[#ffffff15] p-1 rounded-full group-hover:bg-[#D4AF37]/20 transition-colors">
                            <ChevronLeft className="w-5 h-5 text-[#D4AF37]" />
                          </div>
                          <h4 className="text-xl font-medium ml-3 tracking-wide">
                            {selectedSub.label}
                          </h4>
                        </button>
                        
                        <div className="flex items-center">
                          <div className="h-px w-8 bg-[#D4AF37] mr-2" />
                          <p className="text-sm text-[#999]">
                            {selectedSub.subsubcategories.length} items
                          </p>
                        </div>
                      </div>
                      
                      {/* Sub-subcategory Grid */}
                      <div className="flex-grow overflow-y-auto custom-scrollbar py-4">
                        <div className="grid grid-cols-2 gap-4 px-6">
                          {selectedSub.subsubcategories.map((item, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ 
                                duration: 0.3, 
                                delay: idx * 0.03,
                                ease: "easeOut"
                              }}
                              className="group"
                            >
                              <button
                                className="w-full text-left p-4 rounded-xl transition-all duration-300 hover:bg-[#ffffff]/5 border border-[#ffffff10] hover:border-[#D4AF37]/30"
                                onClick={() => handleSubsubcategorySelect(item)}
                              >
                                <div className="flex items-center mb-3">
                                  <div className="w-2 h-2 rounded-full bg-[#D4AF37] mr-3" />
                                  <span className="font-medium tracking-wide">{item}</span>
                                </div>
                                <div className="bg-[#1A1A1A] border border-[#ffffff07] rounded-lg aspect-video flex items-center justify-center">
                                  <div className="text-[#999] text-sm italic">
                                    Product Preview
                                  </div>
                                </div>
                              </button>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Featured Product */}
                      <div className="p-6 border-t border-[#ffffff08]">
                        <div className="bg-gradient-to-r from-[#0A0A0A] to-[#1A1A1A] border border-[#ffffff08] rounded-xl p-5">
                          <h5 className="font-medium text-[#D4AF37] mb-2">
                            Featured Collection
                          </h5>
                          <p className="text-sm text-[#999] mb-3">
                            Discover our exclusive {selectedSub.label} pieces
                          </p>
                          <button 
                            onClick={() => handleNavigation(selectedCategory.label, selectedSub.label)}
                            className="text-sm px-4 py-2 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/20 rounded-lg transition-colors"
                          >
                            View Collection
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </LayoutGroup>
          </div>
        </motion.div>
      )}

      {/* Mobile Menu */}
      {isMobile && (
        <motion.div
          key="mobile"
          className="fixed inset-0 z-[99]"
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{
            type: "spring",
            damping: 38,
            stiffness: 300,
            mass: 0.8
          }}
        >
          <div className="h-full w-full bg-[#0A0A0A] text-white flex flex-col">
            {/* Mobile Header */}
            <div className="p-4 border-b border-[#ffffff08] flex items-center justify-between">
              {selectedCategory || selectedSub ? (
                <button
                  onClick={handleBack}
                  className="flex items-center group"
                >
                  <div className="bg-[#ffffff15] p-2 rounded-full group-hover:bg-[#D4AF37]/20 transition-colors">
                    <ChevronLeft className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <span className="ml-3 text-lg font-medium">
                    {selectedSub ? selectedSub.label : selectedCategory ? selectedCategory.label : 'Menu'}
                  </span>
                </button>
              ) : (
                <div className="flex items-center">
                  <Menu className="w-6 h-6 text-[#D4AF37] mr-3" />
                  <span className="text-xl font-bold">Menu</span>
                </div>
              )}
              
              <button
                onClick={onClose}
                className="text-[#D4AF37] hover:text-white transition-all p-2 rounded-full hover:bg-[#D4AF37]/10"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile Content */}
            <div className="flex-1 overflow-hidden">
              <AnimatePresence mode="wait">
                {!selectedCategory && (
                  <motion.div
                    key="categories"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="h-full overflow-y-auto custom-scrollbar"
                    onAnimationComplete={handleAnimationComplete}
                  >
                    <div className="p-4 space-y-2">
                      {categories.map((cat, idx) => (
                        <motion.button
                          key={cat.label}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          onClick={() => handleCategorySelect(cat)}
                          className="w-full text-left p-4 rounded-xl bg-[#111111] hover:bg-[#1a1a1a] border border-[#ffffff10] hover:border-[#D4AF37]/30 transition-all group"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-3 h-3 bg-[#D4AF37] rounded-full mr-4" />
                              <span className="font-medium text-lg">{cat.label}</span>
                            </div>
                            {cat.subcategories && cat.subcategories.length > 0 ? (
                              <ChevronRight className="w-5 h-5 opacity-60 group-hover:opacity-100 text-[#D4AF37]" />
                            ) : (
                              <div className="w-2 h-2 bg-[#D4AF37]/60 rounded-full" />
                            )}
                          </div>
                          {cat.subcategories && (
                            <p className="text-sm text-[#999] mt-2 ml-7">
                              {cat.subcategories.length} collections
                            </p>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {selectedCategory && !selectedSub && (
                  <motion.div
                    key={`sub-${selectedCategory.label}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="h-full overflow-y-auto custom-scrollbar"
                    onAnimationComplete={handleAnimationComplete}
                  >
                    <div className="p-4 space-y-3">
                      {/* View All Category Button (Mobile) */}
                      <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0 }}
                        onClick={handleViewAll}
                        className="w-full text-left p-4 rounded-xl bg-[#111111] hover:bg-[#1a1a1a] border border-[#ffffff10] hover:border-[#D4AF37]/30 transition-all group"
                      >
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-[#D4AF37] rounded-full mr-4 animate-pulse" />
                          <span className="font-medium text-lg">
                            View All {selectedCategory.label}
                          </span>
                        </div>
                      </motion.button>

                      {selectedCategory.subcategories.map((sub, idx) => (
                        <motion.button
                          key={sub.label}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: (idx + 1) * 0.05 }} // Adjusted delay to account for new button
                          onClick={() => handleSubcategorySelect(sub)}
                          className="w-full text-left p-4 rounded-xl bg-[#111111] hover:bg-[#1a1a1a] border border-[#ffffff10] hover:border-[#D4AF37]/30 transition-all group"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-3 h-3 bg-[#D4AF37] rounded-full mr-4" />
                              <span className="font-medium text-lg">{sub.label}</span>
                            </div>
                            {sub.subsubcategories && sub.subsubcategories.length > 0 ? (
                              <ChevronRight className="w-5 h-5 opacity-60 group-hover:opacity-100 text-[#D4AF37]" />
                            ) : (
                              <div className="w-2 h-2 bg-[#D4AF37]/60 rounded-full" />
                            )}
                          </div>
                          {sub.subsubcategories && (
                            <p className="text-sm text-[#999] mt-2 ml-7">
                              {sub.subsubcategories.length} items
                            </p>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {selectedSub && selectedSub.subsubcategories && (
                  <motion.div
                    key={`subsub-${selectedSub.label}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="h-full overflow-y-auto custom-scrollbar"
                    onAnimationComplete={handleAnimationComplete}
                  >
                    <div className="p-4 space-y-3">
                      {selectedSub.subsubcategories.map((item, idx) => (
                        <motion.button
                          key={item}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          onClick={() => handleSubsubcategorySelect(item)}
                          className="w-full text-left p-4 rounded-xl bg-[#111111] hover:bg-[#1a1a1a] border border-[#ffffff10] hover:border-[#D4AF37]/30 transition-all group"
                        >
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-[#D4AF37] rounded-full mr-4" />
                            <span className="font-medium text-lg">{item}</span>
                          </div>
                          <div className="bg-[#1A1A1A] border border-[#ffffff07] rounded-lg aspect-video flex items-center justify-center mt-3 ml-7">
                            <div className="text-[#999] text-sm italic">
                              Product Preview
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Footer */}
            <div className="p-4 border-t border-[#ffffff08] text-center">
              <Link href="/" onClick={onClose}>
                <img src="/xavique.png" className="w-32 mx-auto mb-2" alt="Xavique"/>
              </Link>
              <p className="text-xs text-[#999]">
                © 2023 Xavique Luxury Goods
              </p>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Custom scrollbar styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(212, 175, 55, 0.05);
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(212, 175, 55, 0.2);
          border-radius: 4px;
          transition: background 0.3s ease;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(212, 175, 55, 0.3);
        }

        /* Mobile specific scrollbar */
        @media (max-width: 768px) {
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
        }
      `}</style>
    </AnimatePresence>
  );
}
// "use client";

  
// // Categories data
// const categories = [
//   {
//     label: "Gifts and Personalization",
//     subcategories: [
//       {
//         label: "Custom Engraving",
//         subsubcategories: ["Leather Goods", "Jewelry", "Watches"],
//       },
//       {
//         label: "Monogramming",
//         subsubcategories: ["Handbags", "Wallets", "Travel Bags"],
//       },
//       { label: "Gift Wrapping" },
//       { label: "Special Editions" },
//     ],
//   },
//   {
//     label: "New",
//     subcategories: [
//       { label: "Latest Releases" },
//       { label: "Trending Now" },
//       {
//         label: "Seasonal Picks",
//         subsubcategories: [
//           "Spring Collection",
//           "Summer Collection",
//           "Winter Collection",
//         ],
//       },
//       { label: "Editor's Choice" },
//     ],
//   },
//   {
//     label: "Bags and Small Leather Goods",
//     subcategories: [
//       { label: "Tote Bags" },
//       { label: "Crossbody Bags" },
//       {
//         label: "Wallets & Cardholders",
//         subsubcategories: ["Bi-Fold", "Tri-Fold", "Card Holders"],
//       },
//     ],
//   },
//   {
//     label: "Women",
//     subcategories: [
//       { label: "Dresses" },
//       { label: "Shoes" },
//       {
//         label: "Jewelry",
//         subsubcategories: ["Necklaces", "Bracelets", "Earrings", "Rings"],
//       },
//       { label: "Handbags" },
//     ],
//   },
//   {
//     label: "Men",
//     subcategories: [
//       { label: "Shoes" },
//       {
//         label: "Watches",
//         subsubcategories: ["Luxury", "Sport", "Classic"],
//       },
//       { label: "Jackets" },
//       { label: "Belts" },
//     ],
//   },
//   {
//     label: "Jewelry",
//     subcategories: [
//       {
//         label: "Necklaces",
//         subsubcategories: ["Gold", "Platinum", "Diamond"],
//       },
//       { label: "Bracelets" },
//       { label: "Rings" },
//       { label: "Earrings" },
//     ],
//   },
//   {
//     label: "Watches",
//     subcategories: [
//       { label: "Luxury Watches" },
//       { label: "Sport Watches" },
//       {
//         label: "Classic Watches",
//         subsubcategories: ["Automatic", "Quartz", "Skeleton"],
//       },
//     ],
//   },
//   {
//     label: "Perfumes",
//     subcategories: [
//       { label: "Women's Perfumes" },
//       { label: "Men's Perfumes" },
//       { label: "Unisex Fragrances" },
//       {
//         label: "Gift Sets",
//         subsubcategories: ["Mini Sets", "Exclusive Sets"],
//       },
//     ],
//   },
//   {
//     label: "Trunks, Travel and Home",
//     subcategories: [
//       { label: "Travel Bags" },
//       { label: "Luggage" },
//       { label: "Decor" },
//     ],
//   },
//   {
//     label: "Services",
//     subcategories: [
//       { label: "Repairs" },
//       { label: "Care & Maintenance" },
//       { label: "Consultations" },
//       { label: "Personal Shopping" },
//     ],
//   },
//   {
//     label: "The Maison Louis Vuitton",
//     subcategories: [
//       { label: "Heritage" },
//       { label: "Art Exhibitions" },
//       { label: "Collaborations" },
//       { label: "Sustainability" },
//     ],
//   },
// ];

// // Helper function to generate URL slugs
// const generateSlug = (text) => {
//   return text
//     .toLowerCase()
//     .replace(/&/g, 'and')
//     .replace(/[^a-z0-9]+/g, '-')
//     .replace(/-+/g, '-')
//     .replace(/^-|-$/g, '');
// };

// // Helper function to generate collection URLs
// const generateCollectionUrl = (category, subcategory = null, subsubcategory = null) => {
//   const categorySlug = generateSlug(category);
  
//   if (subsubcategory) {
//     const subcategorySlug = generateSlug(subcategory);
//     const subsubcategorySlug = generateSlug(subsubcategory);
//     return `/collection/${categorySlug}/${subcategorySlug}/${subsubcategorySlug}`;
//   } else if (subcategory) {
//     const subcategorySlug = generateSlug(subcategory);
//     return `/collection/${categorySlug}/${subcategorySlug}`;
//   } else {
//     return `/collection/${categorySlug}`;
//   }
// };

// export default function FullScreenCategoryMenu({ onClose }) {
//   const router = useRouter();
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [selectedSub, setSelectedSub] = useState(null);
//   const [isAnimating, setIsAnimating] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);
//   const containerRef = useRef(null);
  
//   // Track scroll positions for back navigation
//   const scrollPositions = useRef({
//     category: 0,
//     subcategory: 0,
//     subsubcategory: 0
//   });

//   // Check if mobile on mount
//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 768);
//     };
    
//     checkMobile();
//     window.addEventListener('resize', checkMobile);
    
//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

//   useEffect(() => {
//     const escHandler = (e) => e.key === "Escape" && onClose();
//     window.addEventListener("keydown", escHandler);
    
//     // Prevent background scrolling
//     document.body.style.overflow = "hidden";
    
//     return () => {
//       window.removeEventListener("keydown", escHandler);
//       document.body.style.overflow = "auto";
//     };
//   }, [onClose]);

//   // Handle navigation to collection pages
//   const handleNavigation = (category, subcategory = null, subsubcategory = null) => {
//     const url = generateCollectionUrl(category, subcategory, subsubcategory);
//     router.push(url);
//     onClose();
//   };

//   // Handle category selection with animation lock
//   const handleCategorySelect = (cat) => {
//     if (isAnimating) return;
    
//     // If category has no subcategories, navigate directly
//     if (!cat.subcategories || cat.subcategories.length === 0) {
//       handleNavigation(cat.label);
//       return;
//     }
    
//     setIsAnimating(true);
//     scrollPositions.current.subcategory = 0;
//     scrollPositions.current.subsubcategory = 0;
//     setSelectedCategory(cat);
//     setSelectedSub(null);
//   };

//   // Handle subcategory selection
//   const handleSubcategorySelect = (sub) => {
//     if (isAnimating) return;
    
//     // If subcategory has no subsubcategories, navigate directly
//     if (!sub.subsubcategories || sub.subsubcategories.length === 0) {
//       handleNavigation(selectedCategory.label, sub.label);
//       return;
//     }
    
//     setIsAnimating(true);
//     scrollPositions.current.subsubcategory = 0;
//     setSelectedSub(sub);
//   };

//   // Handle subsubcategory selection
//   const handleSubsubcategorySelect = (item) => {
//     handleNavigation(selectedCategory.label, selectedSub.label, item);
//   };

//   // Handle back navigation
//   const handleBack = () => {
//     if (isAnimating) return;
//     setIsAnimating(true);
    
//     if (selectedSub) {
//       setSelectedSub(null);
//     } else if (selectedCategory) {
//       setSelectedCategory(null);
//     }
//   };

//   // Animation completion handler
//   const handleAnimationComplete = () => {
//     setIsAnimating(false);
//   };

//   return (
//     <AnimatePresence mode="wait">
//       {/* Backdrop with subtle gradient */}
//       <motion.div
//         key="backdrop"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 0.5 }}
//         exit={{ opacity: 0 }}
//         transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
//         className="fixed inset-0 z-[98] bg-gradient-to-br from-black/50 to-[#0a0a0a]/30 backdrop-blur-md"
//         onClick={onClose}
//       />

//       {/* Desktop Menu */}
//       {!isMobile && (
//         <motion.div
//           ref={containerRef}
//           key="desktop"
//           className="fixed inset-0 z-[99]"
//           initial={{ x: "-100%" }}
//           animate={{ x: 0 }}
//           exit={{ x: "-100%" }}
//           transition={{
//             type: "spring",
//             damping: 28,
//             stiffness: 250,
//             mass: 0.8
//           }}
//         >
//           <div
//             className="flex h-screen w-full bg-[#0A0A0A]/90 text-white"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <LayoutGroup>
//               {/* Category Panel (25%) */}
//               <div className="w-1/4 border-r border-[#D4AF37]/20 flex flex-col">
//                 {/* Header */}
//                 <div className="p-6 pb-4 border-b border-[#ffffff08]">
//                   <div className="flex justify-between items-center mb-6">
//                     <Link href="/" className="group">
//                       <div className="flex items-center">
//                         <span className="text-2xl font-bold tracking-wider">
//                           <img src="/xavique.png" className="w-40" alt="Xavique"/>
//                         </span>
//                       </div>
//                     </Link>
//                     <button
//                       onClick={onClose}
//                       className="text-[#D4AF37] hover:text-white transition-all p-1.5 rounded-full hover:bg-[#D4AF37]/10"
//                     >
//                       <X className="w-6 h-6" />
//                     </button>
//                   </div>
                  
//                   <h2 className="text-2xl font-medium text-[#D4AF37] tracking-wide">
//                     Browse Collections
//                   </h2>
//                   <p className="text-sm text-[#999] mt-1">
//                     Explore our luxury categories
//                   </p>
//                 </div>
                
//                 {/* Category List */}
//                 <div className="flex-grow overflow-y-auto custom-scrollbar py-4 px-2">
//                   <div className="space-y-1 px-4">
//                     {categories.map((cat) => (
//                       <button
//                         key={cat.label}
//                         onClick={() => handleCategorySelect(cat)}
//                         className={`w-full text-left px-4 py-3 rounded-lg text-lg transition-all duration-300 group ${
//                           selectedCategory?.label === cat.label
//                             ? "bg-[#D4AF37]/10 text-[#D4AF37]"
//                             : "hover:bg-[#ffffff]/5 text-[#f5f5f5]"
//                         }`}
//                       >
//                         <div className="flex items-center justify-between">
//                           <span className="font-medium tracking-wide">{cat.label}</span>
//                           {cat.subcategories && cat.subcategories.length > 0 ? (
//                             <ChevronRight className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" />
//                           ) : (
//                             <div className="w-2 h-2 bg-[#D4AF37] rounded-full opacity-60" />
//                           )}
//                         </div>
//                       </button>
//                     ))}
//                   </div>
//                 </div>
                
//                 {/* Footer */}
//                 <div className="p-6 border-t border-[#ffffff08] text-center">
//                   <p className="text-sm text-[#999]">
//                     © 2023 Xavique Luxury Goods
//                   </p>
//                 </div>
//               </div>

//               {/* Subcategory Panel (25%) */}
//               <div className="w-1/4">
//                 <AnimatePresence mode="wait">
//                   {selectedCategory && (
//                     <motion.div
//                       key={`sub-${selectedCategory.label}`}
//                       layout
//                       initial={{ opacity: 0, x: -40 }}
//                       animate={{ 
//                         opacity: 1, 
//                         x: 0,
//                         transition: { 
//                           duration: 0.3,
//                           ease: [0.22, 1, 0.36, 1]
//                         } 
//                       }}
//                       exit={{ 
//                         opacity: 0, 
//                         x: -40,
//                         transition: { 
//                           duration: 0.25,
//                           ease: [0.22, 1, 0.36, 1]
//                         }
//                       }}
//                       onAnimationComplete={handleAnimationComplete}
//                       className="h-full bg-[#111111] flex flex-col"
//                     >
//                       {/* Subcategory Header */}
//                       <div className="p-6 pb-4 border-b border-[#ffffff08]">
//                         <button
//                           onClick={handleBack}
//                           className="flex items-center group mb-6"
//                         >
//                           <div className="bg-[#ffffff15] p-1 rounded-full group-hover:bg-[#D4AF37]/20 transition-colors">
//                             <ChevronLeft className="w-5 h-5 text-[#D4AF37]" />
//                           </div>
//                           <h3 className="text-xl font-medium ml-3 tracking-wide">
//                             {selectedCategory.label}
//                           </h3>
//                         </button>
                        
//                         <div className="flex items-center">
//                           <div className="h-px w-8 bg-[#D4AF37] mr-2" />
//                           <p className="text-sm text-[#999]">
//                             {selectedCategory.subcategories.length} collections
//                           </p>
//                         </div>
//                       </div>
                      
//                       {/* Subcategory List */}
//                       <div className="flex-grow overflow-y-auto custom-scrollbar py-4">
//                         <div className="space-y-1 px-6">
//                           {selectedCategory.subcategories.map((sub, i) => (
//                             <div key={i} className="relative">
//                               <button
//                                 onClick={() => handleSubcategorySelect(sub)}
//                                 className={`w-full text-left px-4 py-3 rounded-lg text-lg transition-all duration-300 group ${
//                                   selectedSub?.label === sub.label
//                                     ? "bg-[#D4AF37]/10 text-[#D4AF37]"
//                                     : "hover:bg-[#ffffff]/5 text-[#f5f5f5]"
//                                 }`}
//                               >
//                                 <div className="flex items-center justify-between">
//                                   <span className="font-medium tracking-wide">{sub.label}</span>
//                                   {sub.subsubcategories && sub.subsubcategories.length > 0 ? (
//                                     <ChevronRight className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
//                                   ) : (
//                                     <div className="w-2 h-2 bg-[#D4AF37] rounded-full opacity-60" />
//                                   )}
//                                 </div>
//                               </button>
                              
//                               {/* Decorative element for items with subcategories */}
//                               {sub.subsubcategories && sub.subsubcategories.length > 0 && (
//                                 <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 w-2 h-2 rounded-full bg-[#D4AF37]/30" />
//                               )}
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </div>

//               {/* Sub-Subcategory Panel (50%) */}
//               <div className="w-1/2 border-l border-[#ffffff08]">
//                 <AnimatePresence mode="wait">
//                   {selectedSub && selectedSub.subsubcategories && (
//                     <motion.div
//                       key={`subsub-${selectedSub.label}`}
//                       layout
//                       initial={{ opacity: 0, x: -40 }}
//                       animate={{ 
//                         opacity: 1, 
//                         x: 0,
//                         transition: { 
//                           duration: 0.3,
//                           ease: [0.22, 1, 0.36, 1]
//                         } 
//                       }}
//                       exit={{ 
//                         opacity: 0, 
//                         x: -40,
//                         transition: { 
//                           duration: 0.25,
//                           ease: [0.22, 1, 0.36, 1]
//                         }
//                       }}
//                       onAnimationComplete={handleAnimationComplete}
//                       className="h-full bg-[#0A0A0A] flex flex-col"
//                     >
//                       {/* Sub-subcategory Header */}
//                       <div className="p-6 pb-4 border-b border-[#ffffff08]">
//                         <button
//                           onClick={handleBack}
//                           className="flex items-center group mb-6"
//                         >
//                           <div className="bg-[#ffffff15] p-1 rounded-full group-hover:bg-[#D4AF37]/20 transition-colors">
//                             <ChevronLeft className="w-5 h-5 text-[#D4AF37]" />
//                           </div>
//                           <h4 className="text-xl font-medium ml-3 tracking-wide">
//                             {selectedSub.label}
//                           </h4>
//                         </button>
                        
//                         <div className="flex items-center">
//                           <div className="h-px w-8 bg-[#D4AF37] mr-2" />
//                           <p className="text-sm text-[#999]">
//                             {selectedSub.subsubcategories.length} items
//                           </p>
//                         </div>
//                       </div>
                      
//                       {/* Sub-subcategory Grid */}
//                       <div className="flex-grow overflow-y-auto custom-scrollbar py-4">
//                         <div className="grid grid-cols-2 gap-4 px-6">
//                           {selectedSub.subsubcategories.map((item, idx) => (
//                             <motion.div
//                               key={idx}
//                               initial={{ opacity: 0, y: 20 }}
//                               animate={{ opacity: 1, y: 0 }}
//                               transition={{ 
//                                 duration: 0.3, 
//                                 delay: idx * 0.03,
//                                 ease: "easeOut"
//                               }}
//                               className="group"
//                             >
//                               <button
//                                 className="w-full text-left p-4 rounded-xl transition-all duration-300 hover:bg-[#ffffff]/5 border border-[#ffffff10] hover:border-[#D4AF37]/30"
//                                 onClick={() => handleSubsubcategorySelect(item)}
//                               >
//                                 <div className="flex items-center mb-3">
//                                   <div className="w-2 h-2 rounded-full bg-[#D4AF37] mr-3" />
//                                   <span className="font-medium tracking-wide">{item}</span>
//                                 </div>
//                                 <div className="bg-[#1A1A1A] border border-[#ffffff07] rounded-lg aspect-video flex items-center justify-center">
//                                   <div className="text-[#999] text-sm italic">
//                                     Product Preview
//                                   </div>
//                                 </div>
//                               </button>
//                             </motion.div>
//                           ))}
//                         </div>
//                       </div>
                      
//                       {/* Featured Product */}
//                       <div className="p-6 border-t border-[#ffffff08]">
//                         <div className="bg-gradient-to-r from-[#0A0A0A] to-[#1A1A1A] border border-[#ffffff08] rounded-xl p-5">
//                           <h5 className="font-medium text-[#D4AF37] mb-2">
//                             Featured Collection
//                           </h5>
//                           <p className="text-sm text-[#999] mb-3">
//                             Discover our exclusive {selectedSub.label} pieces
//                           </p>
//                           <button 
//                             onClick={() => handleNavigation(selectedCategory.label, selectedSub.label)}
//                             className="text-sm px-4 py-2 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/20 rounded-lg transition-colors"
//                           >
//                             View Collection
//                           </button>
//                         </div>
//                       </div>
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </div>
//             </LayoutGroup>
//           </div>
//         </motion.div>
//       )}

//       {/* Mobile Menu */}
//       {isMobile && (
//         <motion.div
//           key="mobile"
//           className="fixed inset-0 z-[99]"
//           initial={{ x: "100%" }}
//           animate={{ x: 0 }}
//           exit={{ x: "100%" }}
//           transition={{
//             type: "spring",
//             damping: 30,
//             stiffness: 300,
//             mass: 0.8
//           }}
//         >
//           <div className="h-full w-full bg-[#0A0A0A] text-white flex flex-col">
//             {/* Mobile Header */}
//             <div className="p-4 border-b border-[#ffffff08] flex items-center justify-between">
//               {selectedCategory || selectedSub ? (
//                 <button
//                   onClick={handleBack}
//                   className="flex items-center group"
//                 >
//                   <div className="bg-[#ffffff15] p-2 rounded-full group-hover:bg-[#D4AF37]/20 transition-colors">
//                     <ChevronLeft className="w-5 h-5 text-[#D4AF37]" />
//                   </div>
//                   <span className="ml-3 text-lg font-medium">
//                     {selectedSub ? selectedSub.label : selectedCategory ? selectedCategory.label : 'Menu'}
//                   </span>
//                 </button>
//               ) : (
//                 <div className="flex items-center">
//                   <Menu className="w-6 h-6 text-[#D4AF37] mr-3" />
//                   <span className="text-xl font-bold">Menu</span>
//                 </div>
//               )}
              
//               <button
//                 onClick={onClose}
//                 className="text-[#D4AF37] hover:text-white transition-all p-2 rounded-full hover:bg-[#D4AF37]/10"
//               >
//                 <X className="w-6 h-6" />
//               </button>
//             </div>

//             {/* Mobile Content */}
//             <div className="flex-1 overflow-hidden">
//               <AnimatePresence mode="wait">
//                 {!selectedCategory && (
//                   <motion.div
//                     key="categories"
//                     initial={{ opacity: 0, x: -20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     exit={{ opacity: 0, x: -20 }}
//                     transition={{ duration: 0.3 }}
//                     className="h-full overflow-y-auto custom-scrollbar"
//                     onAnimationComplete={handleAnimationComplete}
//                   >
//                     <div className="p-4 space-y-2">
//                       {categories.map((cat, idx) => (
//                         <motion.button
//                           key={cat.label}
//                           initial={{ opacity: 0, y: 20 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           transition={{ delay: idx * 0.05 }}
//                           onClick={() => handleCategorySelect(cat)}
//                           className="w-full text-left p-4 rounded-xl bg-[#111111] hover:bg-[#1a1a1a] border border-[#ffffff10] hover:border-[#D4AF37]/30 transition-all group"
//                         >
//                           <div className="flex items-center justify-between">
//                             <div className="flex items-center">
//                               <div className="w-3 h-3 bg-[#D4AF37] rounded-full mr-4" />
//                               <span className="font-medium text-lg">{cat.label}</span>
//                             </div>
//                             {cat.subcategories && cat.subcategories.length > 0 ? (
//                               <ChevronRight className="w-5 h-5 opacity-60 group-hover:opacity-100 text-[#D4AF37]" />
//                             ) : (
//                               <div className="w-2 h-2 bg-[#D4AF37]/60 rounded-full" />
//                             )}
//                           </div>
//                           {cat.subcategories && (
//                             <p className="text-sm text-[#999] mt-2 ml-7">
//                               {cat.subcategories.length} collections
//                             </p>
//                           )}
//                         </motion.button>
//                       ))}
//                     </div>
//                   </motion.div>
//                 )}

//                 {selectedCategory && !selectedSub && (
//                   <motion.div
//                     key={`sub-${selectedCategory.label}`}
//                     initial={{ opacity: 0, x: 20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     exit={{ opacity: 0, x: -20 }}
//                     transition={{ duration: 0.3 }}
//                     className="h-full overflow-y-auto custom-scrollbar"
//                     onAnimationComplete={handleAnimationComplete}
//                   >
//                     <div className="p-4 space-y-2">
//                       {selectedCategory.subcategories.map((sub, idx) => (
//                         <motion.button
//                           key={sub.label}
//                           initial={{ opacity: 0, y: 20 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           transition={{ delay: idx * 0.05 }}
//                           onClick={() => handleSubcategorySelect(sub)}
//                           className="w-full text-left p-4 rounded-xl bg-[#111111] hover:bg-[#1a1a1a] border border-[#ffffff10] hover:border-[#D4AF37]/30 transition-all group"
//                         >
//                           <div className="flex items-center justify-between">
//                             <div className="flex items-center">
//                               <div className="w-3 h-3 bg-[#D4AF37] rounded-full mr-4" />
//                               <span className="font-medium text-lg">{sub.label}</span>
//                             </div>
//                             {sub.subsubcategories && sub.subsubcategories.length > 0 ? (
//                               <ChevronRight className="w-5 h-5 opacity-60 group-hover:opacity-100 text-[#D4AF37]" />
//                             ) : (
//                               <div className="w-2 h-2 bg-[#D4AF37]/60 rounded-full" />
//                             )}
//                           </div>
//                           {sub.subsubcategories && (
//                             <p className="text-sm text-[#999] mt-2 ml-7">
//                               {sub.subsubcategories.length} items
//                             </p>
//                           )}
//                         </motion.button>
//                       ))}
//                     </div>
//                   </motion.div>
//                 )}

//                 {selectedSub && selectedSub.subsubcategories && (
//                   <motion.div
//                     key={`subsub-${selectedSub.label}`}
//                     initial={{ opacity: 0, x: 20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     exit={{ opacity: 0, x: -20 }}
//                     transition={{ duration: 0.3 }}
//                     className="h-full overflow-y-auto custom-scrollbar"
//                     onAnimationComplete={handleAnimationComplete}
//                   >
//                     <div className="p-4 space-y-3">
//                       {selectedSub.subsubcategories.map((item, idx) => (
//                         <motion.button
//                           key={item}
//                           initial={{ opacity: 0, y: 20 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           transition={{ delay: idx * 0.05 }}
//                           onClick={() => handleSubsubcategorySelect(item)}
//                           className="w-full text-left p-4 rounded-xl bg-[#111111] hover:bg-[#1a1a1a] border border-[#ffffff10] hover:border-[#D4AF37]/30 transition-all group"
//                         >
//                           <div className="flex items-center">
//                             <div className="w-3 h-3 bg-[#D4AF37] rounded-full mr-4" />
//                             <span className="font-medium text-lg">{item}</span>
//                           </div>
//                           <div className="bg-[#1A1A1A] border border-[#ffffff07] rounded-lg aspect-video flex items-center justify-center mt-3 ml-7">
//                             <div className="text-[#999] text-sm italic">
//                               Product Preview
//                             </div>
//                           </div>
//                         </motion.button>
//                       ))}
//                     </div>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>

//             {/* Mobile Footer */}
//             <div className="p-4 border-t border-[#ffffff08] text-center">
//               <Link href="/" onClick={onClose}>
//                 <img src="/xavique.png" className="w-32 mx-auto mb-2" alt="Xavique"/>
//               </Link>
//               <p className="text-xs text-[#999]">
//                 © 2023 Xavique Luxury Goods
//               </p>
//             </div>
//           </div>
//         </motion.div>
//       )}
      
//       {/* Custom scrollbar styles */}
//       <style jsx global>{`
//         .custom-scrollbar::-webkit-scrollbar {
//           width: 6px;
//           height: 6px;
//         }
        
//         .custom-scrollbar::-webkit-scrollbar-track {
//           background: rgba(212, 175, 55, 0.05);
//           border-radius: 4px;
//         }
        
//         .custom-scrollbar::-webkit-scrollbar-thumb {
//           background: rgba(212, 175, 55, 0.2);
//           border-radius: 4px;
//           transition: background 0.3s ease;
//         }
        
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//           background: rgba(212, 175, 55, 0.3);
//         }

//         /* Mobile specific scrollbar */
//         @media (max-width: 768px) {
//           .custom-scrollbar::-webkit-scrollbar {
//             width: 4px;
//           }
//         }
//       `}</style>
//     </AnimatePresence>
//   );
// }