"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

export default function WishlistPage() {
  const { data: session } = useSession();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      setWishlist([]);
      setLoading(false);
      return;
    }

    const fetchWishlist = async () => {
      try {
        // Fetch wishlist (already populated with product details)
        const wishlistRes = await axios.get(`/api/wishlist/${session.user.id}`);
        const wishlistItems = wishlistRes.data.wishlist || [];
        setWishlist(wishlistItems);
      } catch (err) {
        console.error("Failed to fetch wishlist", err);
        toast.error("Could not load wishlist");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [session]);

  // Remove single item from wishlist
  const removeItem = async (productId) => {
    if (!session) {
      toast.error("Please log in to modify wishlist");
      return;
    }
    try {
      await axios.delete(`/api/wishlist/${session.user.id}`, {
        data: { productId },
      });
      setWishlist(prev => prev.filter(item => item.productId._id !== productId));
      toast.error("Item removed from wishlist");
    } catch (err) {
      console.error("Failed to remove item", err);
      toast.error("Could not remove item");
    }
  };

  // Clear entire wishlist
  const clearWishlist = async () => {
    try {
      await axios.delete(`/api/wishlist/${session.user.id}`);
      setWishlist([]);
      toast.error("Wishlist cleared");
    } catch (err) {
      toast.error("Could not clear wishlist");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#0A0A0A] text-white flex items-center justify-center">
        <p>Loading wishlist...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#0A0A0A] text-white px-4 ">
      <div className="flex justify-between items-center mb-8 pt-[120px] max-w-6xl mx-auto">
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
          {wishlist.map(({ productId }) => (
            productId && (
              <div
                key={productId._id}
                className="relative group rounded-2xl overflow-hidden border border-[#2A2A2A] hover:border-[#D4AF37] hover:shadow-[0_0_20px_#D4AF37] transition-all duration-300"
              >
                {/* Remove button */}
                <button
                  onClick={() => removeItem(productId._id)}
                  className="absolute top-3 right-3 bg-black/60 rounded-full p-1 text-red-400 hover:text-red-500 transition-colors z-20"
                >
                  <X size={18} />
                </button>

                {/* Product Link */}
                <Link href={`/singleproduct/${productId._id}`}>
                  <div className="relative w-full aspect-square">
                    <Image
                      src={productId.images?.[0]?.url || "/placeholder.png"}
                      alt={productId.title || "Product"}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                    <div className="absolute bottom-0 p-4 w-full">
                      <h2 className="font-semibold text-lg text-white group-hover:text-[#D4AF37] transition-colors">
                        {productId.title}
                      </h2>
                      <p className="text-[#D4AF37] font-bold mt-1">
                        ${productId.discountPrice || productId.price}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
}
