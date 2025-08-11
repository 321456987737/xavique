"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useProductStore } from "@/store/productStore";
import ProductCard from "@/components/ProductCard";

export default function CollectionPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const category = searchParams.get("category") || "";
  const subcategory = searchParams.get("subcategory") || "";
  const subsubcategory = searchParams.get("subsubcategory") || "";

  const filters = { category, subcategory, subsubcategory };

  const { products, hasMore, loading, fetchProducts, reset } = useProductStore();

  // Reset and fetch on filters change
  useEffect(() => {
    reset();
    fetchProducts(filters, false);
  }, [category, subcategory, subsubcategory]);

  // Load more handler
  const loadMore = () => {
    if (!loading && hasMore) {
      fetchProducts(filters, true);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f5f0] pt-[120px] pb-20 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto mb-12">
        <h1 className="text-3xl font-light tracking-wider text-[#1a1a1a] mb-2">
          {subsubcategory || subcategory || category || "Collection"}
        </h1>
        <div className="h-px w-20 bg-[#1a1a1a] mb-6"></div>
        <p className="text-[#666] max-w-2xl">
          Discover our exclusive selection of{" "}
          {subsubcategory || subcategory || category || "luxury items"}.
        </p>
      </div>

      {loading && products.length === 0 ? (
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, idx) => (
            <div key={idx} className="animate-pulse">
              <div className="bg-[#e8e3d9] rounded-lg aspect-[3/4] mb-3"></div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="max-w-7xl mx-auto text-center py-20">
          <p className="text-xl text-[#999]">No products found in this collection</p>
        </div>
      ) : (
        <>
          <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} router={router} />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="max-w-7xl mx-auto mt-8 flex justify-center">
              <button
                onClick={loadMore}
                disabled={loading}
                className="px-6 py-2 bg-[#1a1a1a] text-white rounded hover:bg-[#333] transition disabled:opacity-50"
              >
                {loading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// "use client";

// import { useEffect, useState, useCallback } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import { motion } from "framer-motion";
// import useEmblaCarousel from "embla-carousel-react";
// import { Heart, ChevronLeft, ChevronRight } from "lucide-react";

// export default function CollectionPage() {
//   const searchParams = useSearchParams();
//   const router = useRouter();

//   const category = searchParams.get("category");
//   const subcategory = searchParams.get("subcategory");
//   const subsubcategory = searchParams.get("subsubcategory");

//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         setLoading(true);
//         const queryParams = new URLSearchParams({
//           ...(category && { category }),
//           ...(subcategory && { subcategory }),
//           ...(subsubcategory && { subsubcategory }),
//         });
//         const res = await fetch(`/api/getproducts?${queryParams}`);
//         const data = await res.json();
//         if (data.success) {
//           setProducts(data.products);
//         }
//       } catch (error) {
//         console.error("Error fetching products:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, [category, subcategory, subsubcategory]);

//   return (
//     <div className="min-h-screen bg-[#f8f5f0] pt-[120px] pb-20 ">
//       <div className="max-w-7xl mx-auto mb-12">
//         <h1 className="text-3xl font-light tracking-wider text-[#1a1a1a] mb-2">
//           {subsubcategory || subcategory || category || "Collection"}
//         </h1>
//         <div className="h-px w-20 bg-[#1a1a1a] mb-6"></div>
//         <p className="text-[#666] max-w-2xl">
//           Discover our exclusive selection of{" "}
//           {subsubcategory || subcategory || category || "luxury items"}.
//         </p>
//       </div>

//       {loading ? (
//         <div className=" mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 6">
//           {[...Array(8)].map((_, idx) => (
//             <div key={idx} className="animate-pulse">
//               <div className="bg-[#e8e3d9] rounded-lg aspect-[3/4] mb-3"></div>
//             </div>
//           ))}
//         </div>
//       ) : products.length === 0 ? (
//         <div className="max-w-7xl mx-auto text-center py-20">
//           <p className="text-xl text-[#999]">
//             No products found in this collection
//           </p>
//         </div>
//       ) : (
//         <div className="w-full mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 ">
//           {products.map((product) => (
//             <ProductCard key={product._id} product={product} router={router} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// const ProductCard = ({ product, router }) => {
//   const [wishlisted, setWishlisted] = useState(false);

//   return (
//     <motion.div   className="relative hover:scale-101 hover:z-10 transition-all  group">
//       <div
//         onClick={() =>
//   router.push({
//     pathname: `/singleproduct/${product.slug}`,
//     query: { data: JSON.stringify(product) }
//   })
// }
//         className="relative overflow-hidden aspect-[3/4] cursor-pointer  "
//       >
//         {/* Wishlist Heart */}
//         <button
//           onClick={(e) => {
//             e.stopPropagation();
//             setWishlisted(!wishlisted);
//           }}
//           className="absolute top-3 right-3 z-20 p-2 rounded-full 
//             bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm 
//             transition-opacity duration-300 opacity-0 group-hover:opacity-100"
//         >
//           <Heart
//             className="w-5 h-5"
//             fill={wishlisted ? "#d4af37" : "transparent"}
//             strokeWidth={1.5}
//           />
//         </button>

//         <GalleryCarousel
//           images={product.images}
//           title={product.title}
//           category={product.category}
//           price={product.discountPrice || product.price}
//           originalPrice={product.discountPrice ? product.price : null}
//         />
//       </div>
//     </motion.div>
//   );
// };

// const GalleryCarousel = ({
//   images,
//   title,
//   category,
//   price,
//   originalPrice,
// }) => {
//   const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

//   if (!images || images.length === 0) {
//     return (
//       <div className="w-full h-full bg-[#e8e3d9] flex items-center justify-center">
//         <span className="text-[#999] text-sm">NO IMAGE</span>
//       </div>
//     );
//   }

//   return (
//     <div className="relative w-full h-full group">
//       {/* Carousel */}
//       <div className="overflow-hidden w-full h-full" ref={emblaRef}>
//         <div className="flex w-full h-full">
//           {images.map((img, idx) => (
//             <div className="flex-[0_0_100%] min-w-0" key={idx}>
//               <img
//                 src={`${img.url}?tr=h-600,w-600,c-fill,f-auto,q-auto`}
//                 alt={`${title} ${idx + 1}`}
//                 className="w-full h-full object-cover"
//                 loading="lazy"
//               />
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Left & Right Arrows */}
//       {images.length > 1 && (
//         <>
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               emblaApi && emblaApi.scrollPrev();
//             }}
//             className="absolute left-2 top-1/2 -translate-y-1/2 p-1 rounded-full 
//               bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm 
//               transition-opacity duration-300 opacity-0 group-hover:opacity-100 z-20"
//           >
//             <ChevronLeft className="w-5 h-5 md:w-7 md:h-7" />
//           </button>
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               emblaApi && emblaApi.scrollNext();
//             }}
//             className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full 
//               bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm 
//               transition-opacity duration-300 opacity-0 group-hover:opacity-100 z-20"
//           >
//             <ChevronRight className="w-5 h-5 md:w-7 md:h-7" />
//           </button>
//         </>
//       )}

//       {/* Product Info Overlay */}
//       <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent px-4 py-3 text-white flex items-end justify-between">
//   {/* Left: Title & Category */}
//   <div>
//     <h2 className="text-lg  font-bold leading-tight">{title}</h2>
//     <p className="text-[10px] uppercase tracking-widest opacity-80">{category}</p>
//   </div>

//   {/* Right: Price */}
//   <div className="text-right">
//     <p className="text-sm font-medium">${price}</p>
//     {originalPrice && (
//       <p className="text-[10px] line-through opacity-70">${originalPrice}</p>
//     )}
//   </div>
// </div>

//     </div>
//   );
// };
