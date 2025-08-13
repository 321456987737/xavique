"use client";

import { useWishlistStore } from "@/store/wishlistStore";
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlistStore();

  return (
    <div className="min-h-screen w-full bg-[#0A0A0A] text-white px-4 py-10">
      <div className="flex justify-between items-center mb-8 pt-[150px] max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold">My Wishlist</h1>
        {wishlist.length > 0 && (
          <button
            onClick={clearWishlist}
            className="text-sm text-red-400 hover:text-red-500 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {wishlist.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-[50vh] text-center">
          <p className="text-gray-400 mb-4">Your wishlist is empty.</p>
          <Link
            href="/collection"
            className="bg-[#D4AF37] text-black font-semibold px-6 py-3 rounded-2xl hover:bg-[#c39a2f] transition-colors"
          >
            Shop Now
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {wishlist.map((product) => (
            <div
              key={product._id}
              className="relative group rounded-2xl overflow-hidden border border-[#2A2A2A] hover:border-[#D4AF37] hover:shadow-[0_0_20px_#D4AF37] transition-all duration-300"
            >
              {/* Remove button */}
              <button
                onClick={() => removeFromWishlist(product._id)}
                className="absolute top-3 right-3 bg-black/60 rounded-full p-1 text-red-400 hover:text-red-500 transition-colors z-20"
              >
                <X size={18} />
              </button>

              {/* Product Link */}
              <Link href={`/singleproduct/${product._id}`}>
                <div className="relative w-full aspect-square">
                  {/* Background Image */}
                  <Image
                    src={product.images[0].url}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

                  {/* Details inside image */}
                  <div className="absolute bottom-0 p-4 w-full">
                    <h2 className="font-semibold text-lg text-white group-hover:text-[#D4AF37] transition-colors">
                      {product.title}
                    </h2>
                    <p className="text-[#D4AF37] font-bold mt-1">
                      ${product.discountPrice || product.price}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
