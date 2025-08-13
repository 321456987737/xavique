"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Heart } from "lucide-react";
import GalleryCarousel from "@/components/GalleryCarousel";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3, // more time between each card
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 120, // bounce strength
      damping: 10,    // less damping = more bounce
    },
  },
};

const Extracards = ({ category, subcategory, currentproductid }) => {
  console.log(category, subcategory,currentproductid);
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    fetchextrablogs();
  }, [category, subcategory]);

  const fetchextrablogs = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/getextracards", {
        params: { category, subcategory },
      });
      setProducts(res.data.products || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse bg-[#0A0A0A] rounded-xl shadow-md overflow-hidden w-full sm:w-72 h-[380px]">
        {/* Image placeholder */}
        <div className="bg-[#1c1c1c] h-56 w-full" />
        <div className="p-4 space-y-3">
          <div className="h-5 bg-[#1c1c1c] rounded w-3/4" />
          <div className="h-4 bg-[#1c1c1c] rounded w-1/2" />
          <div className="flex gap-2 mt-3">
            <div className="h-4 bg-[#1c1c1c] rounded w-16" />
            <div className="h-4 bg-[#1c1c1c] rounded w-10" />
          </div>
        </div>
      </div>
    );
  }

  // Filter out the current product
  const filteredProducts = products.filter(
    (product) => product._id !== currentproductid
  );

  if (!filteredProducts.length) {
    return <div className="text-white">No products found.</div>;
  }

  return (
    <motion.div
      className="mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 pt-12 gap-6 px-6 bg-[#0A0A0A]"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {filteredProducts.map((product) => (
        <motion.div
          key={product._id}
          className="relative hover:scale-101 hover:z-10 transition-all group"
          variants={cardVariants}
        >
          <div
            onClick={() => router.push(`/singleproduct/${product._id}`)}
            className="relative overflow-hidden aspect-[3/4] cursor-pointer"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setWishlisted(!wishlisted);
              }}
              className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition-opacity duration-300 opacity-0 group-hover:opacity-100"
            >
              <Heart
                className="w-5 h-5"
                fill={wishlisted ? "#d4af37" : "transparent"}
                strokeWidth={1.5}
              />
            </button>

            <GalleryCarousel
              images={product.images}
              title={product.title}
              category={product.category}
              price={product.discountPrice || product.price}
              originalPrice={product.discountPrice ? product.price : null}
            />
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default Extracards;
