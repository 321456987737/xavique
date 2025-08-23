"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef, useCallback, useState } from "react";
import { useProductStore } from "@/store/productStore";
import ProductCard from "@/components/ProductCard";
import { motion, AnimatePresence } from "framer-motion";

// Skeleton Component with Motion
function Skeleton({ className }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className={`animate-pulse bg-[#1a1a1a] ${className}`}
    />
  );
}

// Variants for product cards
const productVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" },
  }),
};

export default function CollectionPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const observer = useRef(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const category = searchParams.get("category") || "";
  const subcategory = searchParams.get("subcategory") || "";
  const subsubcategory = searchParams.get("subsubcategory") || "";

  const filters = { category, subcategory, subsubcategory };
  const { products, hasMore, loading, fetchProducts, reset } = useProductStore();

  // Reset and fetch on filters change
  useEffect(() => {
    const fetchInitial = async () => {
      await reset();
      await fetchProducts(filters, false);
      setIsInitialLoad(false);
    };

    fetchInitial();
  }, [category, subcategory, subsubcategory]);

  // Infinite scroll setup
  const lastProductRef = useCallback(
    (node) => {
      if (loading || !hasMore || isInitialLoad) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && !loading) {
            fetchProducts(filters, true);
          }
        },
        { rootMargin: "200px" }
      );

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, isInitialLoad, filters, fetchProducts]
  );

  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(true);
    }, 7000); // 7 seconds

    return () => clearTimeout(timer); // cleanup on unmount
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pt-[120px] pb-20 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto mb-12">
        <motion.h1
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-3xl font-light tracking-wider text-white mb-2"
        >
          {subsubcategory || subcategory || category || "Collection"}
        </motion.h1>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5 }}
          className="h-px w-20 bg-white mb-6 origin-left"
        ></motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-white max-w-2xl"
        >
          Discover our exclusive selection of{" "}
          {subsubcategory || subcategory || category || "luxury items"}.
        </motion.p>
      </div>

      {isInitialLoad ? (
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, idx) => (
            <Skeleton key={idx} className="rounded-lg aspect-[3/4]" />
          ))}
        </div>
      ) : products.length === 0 && showMessage ? (
        <AnimatePresence>
          <motion.div
            key="empty-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="max-w-7xl mx-auto text-center py-20">
              <p className="text-xl text-[#999]">No products found in this collection</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="bg-[#D4AF37] mt-6 text-black font-semibold px-6 py-3 rounded-2xl hover:bg-[#c39a2f] transition-colors"
                onClick={() => router.push("/collection")}
              >
                Shop Now
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      ) : (
        <>
          <motion.div
            layout
            className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {products.map((product, index) => (
              <motion.div
                key={`${product._id}-${index}`}
                ref={index === products.length - 1 ? lastProductRef : null}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={productVariants}
              >
                <ProductCard product={product} router={router} />
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom loading indicator */}
          {loading && hasMore && (
            <div className="max-w-7xl mx-auto mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, idx) => (
                <Skeleton key={idx} className="rounded-lg aspect-[3/4]" />
              ))}
            </div>
          )}

          {/* End of collection */}
          {!hasMore && products.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="max-w-7xl mx-auto text-center py-12"
            >
              <p className="text-[#999] italic">You’ve reached the end of the collection</p>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}


// "use client";

// import { useSearchParams, useRouter } from "next/navigation";
// import { useEffect, useRef, useCallback, useState } from "react";
// import { useProductStore } from "@/store/productStore";
// import ProductCard from "@/components/ProductCard";
// // Skeleton Component (inline)
// function Skeleton({ className }) {
//   return (
//     <div className={`animate-pulse bg-[#1a1a1a] ${className}`} />
//   );
// }

// export default function CollectionPage() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const observer = useRef(null);
//   const [isInitialLoad, setIsInitialLoad] = useState(true);

//   const category = searchParams.get("category") || "";
//   const subcategory = searchParams.get("subcategory") || "";
//   const subsubcategory = searchParams.get("subsubcategory") || "";

//   const filters = { category, subcategory, subsubcategory };
//   const { products, hasMore, loading, fetchProducts, reset } = useProductStore();

//   // Reset and fetch on filters change
//   useEffect(() => {
//     const fetchInitial = async () => {
//       await reset();
//       await fetchProducts(filters, false);
//       setIsInitialLoad(false);
//     };

//     fetchInitial();
//   }, [category, subcategory, subsubcategory]);

//   // Infinite scroll setup
//   const lastProductRef = useCallback(
//     (node) => {
//       if (loading || !hasMore || isInitialLoad) return;

//       if (observer.current) observer.current.disconnect();

//       observer.current = new IntersectionObserver(
//         (entries) => {
//           if (entries[0].isIntersecting && hasMore && !loading) {
//             fetchProducts(filters, true);
//           }
//         },
//         { rootMargin: "200px" }
//       );

//       if (node) observer.current.observe(node);
//     },
//     [loading, hasMore, isInitialLoad, filters, fetchProducts]
//   );

// const [showMessage, setShowMessage] = useState(false);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setShowMessage(true);
//     }, 7000); // 7 seconds

//     return () => clearTimeout(timer); // cleanup on unmount
//   }, []);

//   return (
//     <div className="min-h-screen bg-[#0A0A0A] text-white pt-[120px] pb-20 px-4 sm:px-8">
//       <div className="max-w-7xl mx-auto mb-12">
//         <h1 className="text-3xl font-light tracking-wider text-white mb-2">
//           {subsubcategory || subcategory || category || "Collection"}
//         </h1>
//         <div className="h-px w-20 bg-white mb-6"></div>
//         <p className="text-white max-w-2xl">
//           Discover our exclusive selection of{" "}
//           {subsubcategory || subcategory || category || "luxury items"}.
//         </p>
//       </div>

//       {isInitialLoad ? (
//         <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
//           {[...Array(8)].map((_, idx) => (
//             <Skeleton key={idx} className="rounded-lg aspect-[3/4]" />
//           ))}
//         </div>
//       ) : products.length === 0 && showMessage ?(
//         <div>
//           <div className="max-w-7xl mx-auto text-center py-20">
//             <p className="text-xl text-[#999]">No products found in this collection</p>
//             <button
//               className="bg-[#D4AF37] mt-6 text-black font-semibold px-6 py-3 rounded-2xl hover:bg-[#c39a2f] transition-colors"
//               onClick={() => router.push("/collection")}
//             >
//               Shop Now
//             </button>
//           </div>
//         </div>
    
//       ) : (
//         <>
//           <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
//             {products.map((product, index) => (
//               <div
//                 key={`${product._id}-${index}`}
//                 ref={index === products.length - 1 ? lastProductRef : null}
//               >
//                 <ProductCard product={product} router={router} />
//               </div>
//             ))}
//           </div>

//           {/* Bottom loading indicator */}
//           {loading && hasMore && (
//             <div className="max-w-7xl mx-auto mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
//               {[...Array(4)].map((_, idx) => (
//                 <Skeleton key={idx} className="rounded-lg aspect-[3/4]" />
//               ))}
//             </div>
//           )}

//           {/* End of collection */}
//           {!hasMore && products.length > 0 && (
//             <div className="max-w-7xl mx-auto text-center py-12">
//               <p className="text-[#999] italic">
//                 You ve reached the end of the collection
//               </p>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }