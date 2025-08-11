"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import GalleryCarousel from "./GalleryCarousel";

export default function ProductCard({ product, router }) {
  const [wishlisted, setWishlisted] = useState(false);
   console.log(product,"this is the product111111");
  return (  
    <motion.div className="relative hover:scale-101 hover:z-10 transition-all group">
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
  );
}
