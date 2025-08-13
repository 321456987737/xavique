"use client";

import { Heart, ShoppingCart } from "lucide-react";
import GalleryCarousel from "./GalleryCarousel";
import { useWishlistStore } from "@/store/wishlistStore";
// import { useCartStore } from "@/store/cartStore";
import toast from "react-hot-toast";

export default function ProductCard({ product, router }) {
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlistStore();
  // const { addToCart } = useCartStore();

  const isWishlisted = wishlist.some((item) => item._id === product._id);

  return (
    <div className="relative hover:scale-101 hover:z-10 transition-all group">
      <div
        onClick={() => router.push(`/singleproduct/${product._id}`)}
        className=" rounded-2xl hover:shadow-[0_0_20px_#D4AF37] shadow-[#D4AF37] hover:border  hover:border-[#D4AF37] relative overflow-hidden aspect-[3/4] cursor-pointer"
      >
        {/* Top Right Icons */}
        <div className="absolute top-3 right-3 z-20 flex gap-2">
          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (isWishlisted) {
                removeFromWishlist(product._id);
                toast.error(`${product.title} removed from wishlist`, {
                  style: {
                    borderRadius: "8px",
                    background: "#0A0A0A", // black
                    color: "#fff",
                    fontSize: "14px",
                    padding: "12px 16px",
                    border: "1px solid #D4AF37", // gold border stays consistent
                  },
                  iconTheme: {
                    primary: "#FF4C4C", // red icon
                    secondary: "#0A0A0A", // black icon background
                  },
                });
              } else {
                addToWishlist(product);
                toast.success(`${product.title} added to wishlist`, {
                  style: {
                    borderRadius: "8px",
                    background: "#0A0A0A", // black background
                    color: "#fff",
                    fontSize: "14px",
                    padding: "12px 16px",
                    border: "1px solid #D4AF37", // gold border
                  },
                  iconTheme: {
                    primary: "#D4AF37", // gold icon color
                    secondary: "#0A0A0A", // icon background
                  },
                });
              }
            }}
            className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition-colors"
          >
            <Heart
              className="w-5 h-5 text-[#D4AF37]"
              fill={isWishlisted ? "#D4AF37" : "transparent"}
              strokeWidth={1.5}
            />
          </button>

          {/* Cart Button */}
          {/* <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product, 1);
              toast.success(`${product.title} added to cart`);
            }}
            className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition-colors"
          >
            <ShoppingCart
              className="w-5 h-5 text-[#D4AF37]"
              strokeWidth={1.5}
            />
          </button> */}
        </div>

        {/* Product Images Carousel */}
        <GalleryCarousel
          images={product.images}
          title={product.title}
          category={product.category}
          price={product.discountPrice || product.price}
          originalPrice={product.discountPrice ? product.price : null}
        />
      </div>
    </div>
  );
}
