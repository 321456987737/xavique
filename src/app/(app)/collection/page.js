"use client";
import Collection from "@/components/collection";
import { Suspense } from "react";
export default function CollectionPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
    <div className="min-h-screen bg-[#0A0A0A] text-white  pb-20 px-4 sm:px-8">
      
      <Collection />
    </div>
    </Suspense>
  );
}


// "use client";

// import { useSearchParams, useRouter } from "next/navigation";
// import { useEffect } from "react";
// import { useProductStore } from "@/store/productStore";
// import ProductCard from "@/components/ProductCard";

// export default function CollectionPage() {
//   const searchParams = useSearchParams();
//   const router = useRouter();

//   const category = searchParams.get("category") || "";
//   const subcategory = searchParams.get("subcategory") || "";
//   const subsubcategory = searchParams.get("subsubcategory") || "";

//   const filters = { category, subcategory, subsubcategory };

//   const { products, hasMore, loading, fetchProducts, reset } = useProductStore();

//   // Reset and fetch on filters change
//   useEffect(() => {
//     reset();
//     fetchProducts(filters, false);
//   }, [category, subcategory, subsubcategory]);

//   // Load more handler
//   const loadMore = () => {
//     if (!loading && hasMore) {
//       fetchProducts(filters, true);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#0A0A0A] text-white pt-[120px] pb-20 px-4 sm:px-8">
//       <div className="max-w-7xl mx-auto mb-12">
//         <h1 className="text-3xl font-light tracking-wider text-white mb-2">
//           {subsubcategory || subcategory || category || "Collection"}
//         </h1>
//         <div className="h-px w-20 text-white mb-6"></div>
//         <p className="text-white max-w-2xl">
//           Discover our exclusive selection of{" "}
//           {subsubcategory || subcategory || category || "luxury items"}.
//         </p>
//       </div>

//       {loading && products.length === 0 ? (
//         <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
//           {[...Array(8)].map((_, idx) => (
//             <div key={idx} className="animate-pulse">
//               <div className="bg-[#e8e3d9] rounded-lg aspect-[3/4] mb-3"></div>
//             </div>
//           ))}
//         </div>
//       ) : products.length === 0 ? (
//         <div className="max-w-7xl mx-auto text-center py-20">
//           <p className="text-xl text-[#999]">No products found in this collection</p>
//         </div>
//       ) : (
//         <>
//           <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
//             {products.map((product) => (
//               <ProductCard key={product._id} product={product} router={router} />
//             ))}
//           </div>

//           {/* Load More Button */}
//           {hasMore && (
//             <div className="max-w-7xl mx-auto mt-8 flex justify-center">
//               <button
//                 onClick={loadMore}
//                 disabled={loading}
//                 className="px-6 py-2 bg-[#1a1a1a] text-white rounded hover:bg-[#333] transition disabled:opacity-50"
//               >
//                 {loading ? "Loading..." : "Load More"}
//               </button>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }
