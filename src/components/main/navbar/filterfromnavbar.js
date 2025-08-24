"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { ChevronRight, ChevronLeft, X, Menu, Star, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

// Sample product data for demonstration
const sampleProducts = {
  "Necklaces": [
    { id: 1, name: "Diamond Pendant Necklace", price: "$299", rating: 4.8, image: "/create_an_image_of_women_jewelery_that.jpeg" },
    { id: 2, name: "Gold Chain Necklace", price: "$199", rating: 4.5, image: "/design_a_bold_high_fashion_statement_bag_for.jpeg" },
    { id: 3, name: "Pearl Elegance Necklace", price: "$249", rating: 4.7, image: "/design_a_high_fashion_luxury_women_s_dress_inspired.jpeg" },
    { id: 4, name: "Silver Moon Pendant", price: "$159", rating: 4.3, image: "/design_a_large_elegant_women_s_fashion_cap.jpeg" },
  ],
  "Bracelets": [
    { id: 5, name: "Gold Link Bracelet", price: "$179", rating: 4.6, image: "/create_an_image_of_women_jewelery_that.jpeg" },
    { id: 6, name: "Silver Charm Bracelet", price: "$149", rating: 4.4, image: "/design_a_bold_high_fashion_statement_bag_for.jpeg" },
    { id: 7, name: "Diamond Tennis Bracelet", price: "$399", rating: 4.9, image: "/design_a_high_fashion_luxury_women_s_dress_inspired.jpeg" },
  ],
  "Earrings": [
    { id: 8, name: "Diamond Stud Earrings", price: "$229", rating: 4.7, image: "/create_an_image_of_women_jewelery_that.jpeg" },
    { id: 9, name: "Gold Hoop Earrings", price: "$129", rating: 4.5, image: "/design_a_bold_high_fashion_statement_bag_for.jpeg" },
    { id: 10, name: "Pearl Drop Earrings", price: "$189", rating: 4.6, image: "/design_a_high_fashion_luxury_women_s_dress_inspired.jpeg" },
  ],
  "Rings": [
    { id: 11, name: "Diamond Solitaire Ring", price: "$499", rating: 4.9, image: "/design_a_bold_high_fashion_statement_bag_for.jpeg" },
    { id: 12, name: "Gold Band Ring", price: "$149", rating: 4.4, image: "/create_an_image_of_women_jewelery_that.jpeg" },
    { id: 13, name: "Sapphire Statement Ring", price: "$349", rating: 4.7, image: "/api/placeholder/200/250" },
  ],
  "Luxury": [
    { id: 14, name: "Platinum Chronograph", price: "$1299", rating: 4.9, image: "/design_a_bold_high_fashion_statement_bag_for.jpeg" },
    { id: 15, name: "Gold Presidential", price: "$999", rating: 4.8, image: "/create_an_image_of_women_jewelery_that.jpeg" },
  ],
  "Sport": [
    { id: 16, name: "Diver's Professional", price: "$599", rating: 4.6, image: "/design_a_bold_high_fashion_statement_bag_for.jpeg" },
    { id: 17, name: "Chronograph Sports", price: "$449", rating: 4.5, image: "/create_an_image_of_women_jewelery_that.jpeg" },
  ],
  "Classic": [
    { id: 18, name: "Vintage Leather", price: "$299", rating: 4.7, image: "/create_an_image_of_women_jewelery_that.jpeg" },
    { id: 19, name: "Minimalist Design", price: "$199", rating: 4.4, image: "/design_a_bold_high_fashion_statement_bag_for.jpeg" },
  ],
  "Spring Collection": [
    { id: 20, name: "Floral Print Dress", price: "$89", rating: 4.5, image: "/create_an_image_of_women_jewelery_that.jpeg" },
    { id: 21, name: "Pastel Blouse", price: "$59", rating: 4.3, image: "/design_a_bold_high_fashion_statement_bag_for.jpeg" },
  ],
  "Summer Collection": [
    { id: 22, name: "Linen Shirt", price: "$79", rating: 4.6, image: "/design_a_bold_high_fashion_statement_bag_for.jpeg" },
    { id: 23, name: "Beach Cover-up", price: "$49", rating: 4.2, image: "/create_an_image_of_women_jewelery_that.jpeg" },
  ],
  "Winter Collection": [
    { id: 24, name: "Wool Coat", price: "$199", rating: 4.8, image: "/design_a_bold_high_fashion_statement_bag_for.jpeg" },
    { id: 25, name: "Cashmere Sweater", price: "$149", rating: 4.7, image: "/create_an_image_of_women_jewelery_that.jpeg" },
  ]
};

// Categories data
const categories = [
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
    label: "Women",
    subcategories: [
      { label: "Dresses" },
      { label: "Bags" },
      { label: "Shoes" },
      { label: "Jeans" },
      { label: "T-Shirts" },
      { label: "Jackets" },
      { label: "Sweaters" },
      { label: "Hoodies" },
      { label: "Handbags" },
      {
        label: "Jewelry",
        subsubcategories: ["Necklaces", "Bracelets", "Earrings", "Rings"],
      },
      { label: "Belts" },
      { label: "Watches" },
      { label: "Sunglasses" },
      { label: "Scarves" },
      { label: "Gloves" },
      { label: "Formal Wear" },
      { label: "Sportswear" },
      { label: "Accessories" },
    ],
  },
  {
    label: "Men",
    subcategories: [
      { label: "Shoes" },
      { label: "Shirts" },
      { label: "Jeans" },
      { label: "T-Shirts" },
      { label: "Jackets" },
      { label: "Sweaters" },
      { label: "Hoodies" },
      { label: "Belts" },
      {
        label: "Watches",
        subsubcategories: ["Luxury", "Sport", "Classic"],
      },
      { label: "Wallets" },
      { label: "Sunglasses" },
      { label: "Caps" },
      { label: "Formal Wear" },
      { label: "Sportswear" },
      { label: "Accessories" },
    ],
  },
  {
    label: "Kids",
    subcategories: [
      { label: "Shoes" },
      { label: "T-Shirts" },
      { label: "Shorts" },
      { label: "Jeans" },
      { label: "Jackets" },
      { label: "Sweaters" },
      { label: "Hoodies" },
      { label: "Caps" },
      { label: "Sportswear" },
      { label: "Accessories" },
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

  // Handle "View All" for category
  const handleViewAll = () => {
    handleNavigation(selectedCategory.label);
  };

  // Get products for the current subsubcategory
  const getProductsForSubsubcategory = (subsubcategoryLabel) => {
    return sampleProducts[subsubcategoryLabel] || [];
  };

  return (
    <AnimatePresence>
      {/* Desktop Menu */}
      {!isMobile && (
        <motion.div
          className="fixed inset-0 z-[99]"
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
                            {selectedSub.subsubcategories.length} categories
                          </p>
                        </div>
                      </div>
                      
                      {/* Sub-subcategory Grid */}
                      <div className="flex-grow overflow-y-auto custom-scrollbar py-4">
                        <div className="grid grid-cols-2 gap-4 px-6">
                          {selectedSub.subsubcategories.map((item, idx) => {
                            const products = getProductsForSubsubcategory(item);
                            return (
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
                                <div className="w-full text-left p-4 rounded-xl transition-all duration-300 hover:bg-[#ffffff]/5 border border-[#ffffff10] hover:border-[#D4AF37]/30">
                                  <div className="flex items-center mb-3">
                                    <div className="w-2 h-2 rounded-full bg-[#D4AF37] mr-3" />
                                    <span className="font-medium tracking-wide">{item}</span>
                                  </div>
                                  
                                  {/* Products Carousel */}
                                  <div className="relative overflow-hidden rounded-lg bg-[#1A1A1A] border border-[#ffffff07]">
                                    <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar">
                                      {products.length > 0 ? (
                                        products.map((product, productIdx) => (
                                          <div key={product.id} className="flex-shrink-0 w-full snap-start">
                                            <div className="relative aspect-[3/4] overflow-hidden">
                                              <img 
                                                src={product.image} 
                                                alt={product.name}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                              />
                                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                                                <div className="text-white">
                                                  <h5 className="font-medium text-sm truncate">{product.name}</h5>
                                                  <div className="flex items-center justify-between mt-1">
                                                    <span className="text-[#D4AF37] font-medium text-xs">{product.price}</span>
                                                    <div className="flex items-center">
                                                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                                      <span className="text-xs ml-1">{product.rating}</span>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        ))
                                      ) : (
                                        <div className="w-full aspect-[3/4] flex items-center justify-center text-[#999] text-sm italic">
                                          Product Preview
                                        </div>
                                      )}
                                    </div>
                                    
                                    {/* Navigation dots */}
                                    {products.length > 1 && (
                                      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                                        {products.map((_, dotIdx) => (
                                          <div 
                                            key={dotIdx}
                                            className="w-1.5 h-1.5 rounded-full bg-white/30"
                                          />
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                  
                                  <button
                                    onClick={() => handleSubsubcategorySelect(item)}
                                    className="w-full mt-3 py-2 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#D4AF37] text-sm font-medium rounded-lg transition-colors flex items-center justify-center"
                                  >
                                    <ShoppingBag className="w-4 h-4 mr-2" />
                                    View Collection
                                  </button>
                                </div>
                              </motion.div>
                            );
                          })}
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
          className="fixed inset-0 z-[99] "
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
            <div className="p-4 border-b border-[#ffffff08]  flex items-center justify-between">
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
                      {selectedSub.subsubcategories.map((item, idx) => {
                        const products = getProductsForSubsubcategory(item);
                        return (
                          <motion.div
                            key={item}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="w-full text-left p-4 rounded-xl bg-[#111111] hover:bg-[#1a1a1a] border border-[#ffffff10] hover:border-[#D4AF37]/30 transition-all group"
                          >
                            <div className="flex items-center mb-3">
                              <div className="w-3 h-3 bg-[#D4AF37] rounded-full mr-4" />
                              <span className="font-medium text-lg">{item}</span>
                            </div>
                            
                            {/* Products Carousel for Mobile */}
                            <div className="relative overflow-hidden rounded-lg bg-[#1A1A1A] border border-[#ffffff07]">
                              <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar">
                                {products.length > 0 ? (
                                  products.map((product) => (
                                    <div key={product.id} className="flex-shrink-0 w-full snap-start">
                                      <div className="relative aspect-[3/4] overflow-hidden">
                                        <img 
                                          src={product.image} 
                                          alt={product.name}
                                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                                          <div className="text-white">
                                            <h5 className="font-medium text-sm truncate">{product.name}</h5>
                                            <div className="flex items-center justify-between mt-1">
                                              <span className="text-[#D4AF37] font-medium text-xs">{product.price}</span>
                                              <div className="flex items-center">
                                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                                <span className="text-xs ml-1">{product.rating}</span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <div className="w-full aspect-[3/4] flex items-center justify-center text-[#999] text-sm italic">
                                    Product Preview
                                  </div>
                                )}
                              </div>
                              
                              {/* Navigation dots */}
                              {products.length > 1 && (
                                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                                  {products.map((_, dotIdx) => (
                                    <div 
                                      key={dotIdx}
                                      className="w-1.5 h-1.5 rounded-full bg-white/30"
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                            
                            <button
                              onClick={() => handleSubsubcategorySelect(item)}
                              className="w-full mt-3 py-2 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#D4AF37] text-sm font-medium rounded-lg transition-colors flex items-center justify-center"
                            >
                              <ShoppingBag className="w-4 h-4 mr-2" />
                              View Collection
                            </button>
                          </motion.div>
                        );
                      })}
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

        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
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

// import React, { useEffect, useState, useRef } from "react";
// import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
// import { ChevronRight, ChevronLeft, X, Menu } from "lucide-react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import axios from "axios";

// // Categories data
// const categories = [
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
//     label: "Women",
//     subcategories: [
//       { label: "Dresses" },
//       { label: "Bags" },
//       { label: "Shoes" },
//       { label: "Jeans" },
//       { label: "T-Shirts" },
//       { label: "Jackets" },
//       { label: "Sweaters" },
//       { label: "Hoodies" },
//       { label: "Handbags" },
//       {
//         label: "Jewelry",
//         subsubcategories: ["Necklaces", "Bracelets", "Earrings", "Rings"],
//       },
//       { label: "Belts" },
//       { label: "Watches" },
//       { label: "Sunglasses" },
//       { label: "Scarves" },
//       { label: "Gloves" },
//       { label: "Formal Wear" },
//       { label: "Sportswear" },
//       { label: "Accessories" },
//     ],
//   },
//   {
//     label: "Men",
//     subcategories: [
//       { label: "Shoes" },
//       { label: "Shirts" },
//       { label: "Jeans" },
//       { label: "T-Shirts" },
//       { label: "Jackets" },
//       { label: "Sweaters" },
//       { label: "Hoodies" },
//       { label: "Belts" },
//       {
//         label: "Watches",
//         subsubcategories: ["Luxury", "Sport", "Classic"],
//       },
//       { label: "Wallets" },
//       { label: "Sunglasses" },
//       { label: "Caps" },
//       { label: "Formal Wear" },
//       { label: "Sportswear" },
//       { label: "Accessories" },
//     ],
//   },
//   {
//     label: "Kids",
//     subcategories: [
//       { label: "Shoes" },
//       { label: "T-Shirts" },
//       { label: "Shorts" },
//       { label: "Jeans" },
//       { label: "Jackets" },
//       { label: "Sweaters" },
//       { label: "Hoodies" },
//       { label: "Caps" },
//       { label: "Sportswear" },
//       { label: "Accessories" },
//     ],
//   },
// ];



// // Helper function to generate URL slugs
// const generateSlug = (text) => {
//   return text
//     .replace(/&/g, 'and')
//     .replace(/[^a-zA-Z0-9]+/g, '-')
//     .replace(/-+/g, '-')
//     .replace(/^-|-$/g, '');
// };

// // Helper function to generate collection URLs
// const generateCollectionUrl = (category, subcategory = null, subsubcategory = null) => {
//   const categorySlug = generateSlug(category);
//     console.log(categorySlug,subcategory,subsubcategory)
//   if (subsubcategory) {
//   const subcategorySlug = generateSlug(subcategory);
//   const subsubcategorySlug = generateSlug(subsubcategory);
//   return `/collection?category=${categorySlug}&subcategory=${subcategorySlug}&subsubcategory=${subsubcategorySlug}`;
// } else if (subcategory) {
//   const subcategorySlug = generateSlug(subcategory);
//   return `/collection?category=${categorySlug}&subcategory=${subcategorySlug}`;
// } else {
//   return `/collection?category=${categorySlug}`;
// }
// }

// export default function FullScreenCategoryMenu({ onClose }) {
//   const router = useRouter();
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [selectedSub, setSelectedSub] = useState(null);
//   const [isAnimating, setIsAnimating] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);
//   const containerRef = useRef(null);
  

//   useEffect(() => {
//     const fetchcategories = async function () {
//       const response = await axios.get("/api/getcategories");
//     }
//   }, [])
  
  
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

//   // NEW: Handle "View All" for category
//   const handleViewAll = () => {
//     handleNavigation(selectedCategory.label);
//   };

//   return (
//     <AnimatePresence
//     //  mode="wait"
//      >

//       {/* Desktop Menu */}
//       {!isMobile && (
//         <motion.div
//         className="fixed  inset-0 z-[99]"
//           ref={containerRef}
//           key="desktop"
//           initial={{ x: "-100%" }}
//           animate={{ x: 0 }}
//           exit={{ x: "-100%" }}
//           transition={{
//             type: "spring",
//             damping: 30,
//             stiffness: 300,
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
                      
//                       {/* Subcategory List with View All button */}
//                       <div className="flex-grow overflow-y-auto custom-scrollbar py-4">
//                         <div className="space-y-2 px-6">
//                           {/* View All Category Button */}
//                           <button
//                             onClick={handleViewAll}
//                             className={`w-full text-left px-4 py-3 rounded-lg text-lg transition-all duration-300 group ${
//                               "hover:bg-[#ffffff]/5 text-[#f5f5f5] border border-[#ffffff10] hover:border-[#D4AF37]/30"
//                             }`}
//                           >
//                             <div className="flex items-center justify-between">
//                               <span className="font-medium tracking-wide">
//                                 View All {selectedCategory.label}
//                               </span>
//                               <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse" />
//                             </div>
//                           </button>

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
//           className="fixed inset-0 z-[99] "
//           initial={{ x: "-100%" }}
//           animate={{ x: 0 }}
//           exit={{ x: "100%" }}
//           transition={{
//             type: "spring",
//             damping: 38,
//             stiffness: 300,
//             mass: 0.8
//           }}
//         >
//             <div className="h-full w-full bg-[#0A0A0A] text-white flex flex-col">
//             {/* Mobile Header */}
//             <div className="p-4 border-b border-[#ffffff08]  flex items-center justify-between">
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
//                     <div className="p-4 space-y-3">
//                       {/* View All Category Button (Mobile) */}
//                       <motion.button
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ delay: 0 }}
//                         onClick={handleViewAll}
//                         className="w-full text-left p-4 rounded-xl bg-[#111111] hover:bg-[#1a1a1a] border border-[#ffffff10] hover:border-[#D4AF37]/30 transition-all group"
//                       >
//                         <div className="flex items-center">
//                           <div className="w-3 h-3 bg-[#D4AF37] rounded-full mr-4 animate-pulse" />
//                           <span className="font-medium text-lg">
//                             View All {selectedCategory.label}
//                           </span>
//                         </div>
//                       </motion.button>

//                       {selectedCategory.subcategories.map((sub, idx) => (
//                         <motion.button
//                           key={sub.label}
//                           initial={{ opacity: 0, y: 20 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           transition={{ delay: (idx + 1) * 0.05 }} // Adjusted delay to account for new button
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