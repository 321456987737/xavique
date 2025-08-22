
"use client";
import React, { useState, useRef, useEffect } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Searchbar({ onClose }) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const router = useRouter();

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 500);
    return () => clearTimeout(timer);
  }, [query]);

  // Fetch search results
  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedQuery.trim()) {
        setResults([]);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`);
        if (!response.ok) throw new Error("Failed to fetch results");
        const data = await response.json();
        setResults(data.products || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResults();
  }, [debouncedQuery]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Close on click outside or ESC
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) onClose?.();
    }
    function handleKeyDown(e) {
      if (e.key === "Escape") onClose?.();
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      onClose?.();
    }
  };

  const handleProductClick = (productId) => {
    router.push(`/singleproduct/${productId}`);
    onClose?.();
  };

  return (
    <AnimatePresence>
      <>
        {/* Overlay */}
        <motion.div
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Search Modal */}
        <motion.div
          ref={wrapperRef}
          className="fixed top-[15%] left-1/2 -translate-x-1/2 z-[60] w-[95vw] max-w-3xl"
          initial={{ opacity: 0, scale: 0.95, y: -40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -40 }}
          transition={{ duration: 0.4 }}
        >
          <form onSubmit={handleSubmit}>
            <div
              className="relative flex items-center bg-gradient-to-r from-[#0a0a0a] to-[#1A1A1A] border border-[#D4AF37]/50 rounded-2xl"
              style={{ boxShadow: "0 0 25px rgba(212,175,55,0.4)" }}
            >
              <div className="pl-6">
                <Search className="text-[#D4AF37]" size={22} />
              </div>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search luxury..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full p-5 bg-transparent text-white text-lg outline-none placeholder-gray-400"
              />
              <button
                type="button"
                onClick={onClose}
                className="bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-black p-4 m-2 rounded-xl hover:shadow-[0_0_10px_#D4AF37] transition-all duration-300"
              >
                <X size={20} />
              </button>
            </div>
          </form>

          {/* Results */}
          {(isLoading || results.length > 0 || error) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="custom-scrollbar mt-4 w-full max-h-96 overflow-y-auto rounded-2xl bg-gradient-to-r from-[#0a0a0a] to-[#1A1A1A] border border-[#D4AF37]/40"
              style={{ boxShadow: "0 0 25px rgba(212,175,55,0.3)" }}
            >
              {isLoading && (
                <div className="p-6 flex justify-center items-center">
                  <Loader2 className="animate-spin text-[#D4AF37]" size={24} />
                </div>
              )}

              {error && (
                <div className="p-6 text-red-400 text-center">Error: {error}</div>
              )}

              {!isLoading && results.length === 0 && debouncedQuery && (
                <div className="p-6 text-gray-400 text-center">
                  No products found for <span className="text-white">{debouncedQuery}</span>
                </div>
              )}

              {!isLoading && results.length > 0 && (
                <div className="p-4">
                  <h3 className="text-[#D4AF37] text-sm font-semibold mb-3 px-2">
                    Search Results ({results.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    {results.map((product) => (
                      <motion.div
                        key={product.id}
                        whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(212,175,55,0.4)" }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className="bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a] border border-[#D4AF37]/30 rounded-2xl cursor-pointer overflow-hidden transition-shadow"
                        onClick={() => handleProductClick(product.id)}
                      >
                        {/* Image */}
                        <div className="relative w-full h-40 overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        {/* Info */}
                        <div className="p-4">
                          <h4 className="text-white font-semibold text-lg truncate">
                            {product.name}
                          </h4>
                          <p className="text-[#D4AF37] font-bold mt-1">
                            ${product.price}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </>
    </AnimatePresence>
  );
}

// "use client";
// import React, { useState, useRef, useEffect } from "react";
// import { Search, X, Loader2 } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useRouter } from "next/navigation";

// export default function Searchbar({ onClose }) {
//   const [query, setQuery] = useState("");
//   const [debouncedQuery, setDebouncedQuery] = useState("");
//   const [results, setResults] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const wrapperRef = useRef(null);
//   const inputRef = useRef(null);
//   const router = useRouter();

//   // Debounce
//   useEffect(() => {
//     const timer = setTimeout(() => setDebouncedQuery(query), 500);
//     return () => clearTimeout(timer);
//   }, [query]);

//   // Fetch data
//   useEffect(() => {
//     const fetchResults = async () => {
//       if (!debouncedQuery.trim()) {
//         setResults([]);
//         return;
//       }
//       setIsLoading(true);
//       setError(null);
//       try {
//         const response = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`);
//         if (!response.ok) throw new Error("Failed to fetch results");
//         const data = await response.json();
//         setResults(data.products || []);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchResults();
//   }, [debouncedQuery]);

//   useEffect(() => {
//     inputRef.current?.focus();
//   }, []);

//   useEffect(() => {
//     function handleClickOutside(e) {
//       if (wrapperRef.current && !wrapperRef.current.contains(e.target)) onClose?.();
//     }
//     function handleKeyDown(e) {
//       if (e.key === "Escape") onClose?.();
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     document.addEventListener("keydown", handleKeyDown);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//       document.removeEventListener("keydown", handleKeyDown);
//     };
//   }, [onClose]);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (query.trim()) {
//       router.push(`/search?q=${encodeURIComponent(query)}`);
//       onClose?.();
//     }
//   };

//   const handleProductClick = (productId) => {
//     router.push(`/singleproduct/${productId}`);
//     onClose?.();
//   };

//   return (
//     <AnimatePresence>
//       <>
//         {/* Overlay */}
//         <motion.div
//           className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           transition={{ duration: 0.3 }}
//         />

//         {/* Search Modal */}
//         <motion.div
//           ref={wrapperRef}
//           className="fixed top-[15%] left-1/2 -translate-x-1/2 z-[60] w-[95vw] max-w-3xl"
//           initial={{ opacity: 0, scale: 0.95, y: -40 }}
//           animate={{ opacity: 1, scale: 1, y: 0 }}
//           exit={{ opacity: 0, scale: 0.95, y: -40 }}
//           transition={{ duration: 0.4 }}
//         >
//           <form onSubmit={handleSubmit}>
//             <div
//               className="relative flex items-center bg-gradient-to-r from-[#0a0a0a] to-[#1A1A1A] border border-[#D4AF37]/50 rounded-2xl"
//               style={{ boxShadow: "0 0 25px rgba(212,175,55,0.4)" }}
//             >
//               <div className="pl-6">
//                 <Search className="text-[#D4AF37]" size={22} />
//               </div>
//               <input
//                 ref={inputRef}
//                 type="text"
//                 placeholder="Search luxury..."
//                 value={query}
//                 onChange={(e) => setQuery(e.target.value)}
//                 className="w-full p-5 bg-transparent text-white text-lg outline-none placeholder-gray-400"
//               />
//               <button
//                 type="button"
//                 onClick={onClose}
//                 className="bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-black p-4 m-2 rounded-xl hover:shadow-[0_0_10px_#D4AF37] transition-all duration-300"
//               >
//                 <X size={20} />
//               </button>
//             </div>
//           </form>

//           {/* Results */}
//           {(isLoading || results.length > 0 || error) && (
//             <motion.div
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="mt-4 w-full max-h-96 overflow-y-auto rounded-2xl bg-gradient-to-r from-[#0a0a0a] to-[#1A1A1A] border border-[#D4AF37]/40"
//               style={{ boxShadow: "0 0 25px rgba(212,175,55,0.3)" }}
//             >
//               {/* Scrollbar Styling */}
//               <style jsx>{`
//                 div::-webkit-scrollbar {
//                   width: 8px;
//                 }
//                 div::-webkit-scrollbar-track {
//                   background: #0a0a0a;
//                 }
//                 div::-webkit-scrollbar-thumb {
//                   background: linear-gradient(#D4AF37, #F4D03F);
//                   border-radius: 4px;
//                 }
//                 div::-webkit-scrollbar-thumb:hover {
//                   background: #D4AF37;
//                 }
//               `}</style>

//               {isLoading && (
//                 <div className="p-6 flex justify-center items-center">
//                   <Loader2 className="animate-spin text-[#D4AF37]" size={24} />
//                 </div>
//               )}

//               {error && (
//                 <div className="p-6 text-red-400 text-center">Error: {error}</div>
//               )}

//               {!isLoading && results.length === 0 && debouncedQuery && (
//                 <div className="p-6 text-gray-400 text-center">
//                   No products found for <span className="text-white">{debouncedQuery}</span>
//                 </div>
//               )}

//               {!isLoading && results.length > 0 && (
//                 <div className="p-4">
//                   <h3 className="text-[#D4AF37] text-sm font-semibold mb-3 px-2">
//                     Search Results ({results.length})
//                   </h3>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     {results.map((product) => (
//                       <motion.div
//                         key={product.id}
//                         whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(212,175,55,0.4)" }}
//                         transition={{ type: "spring", stiffness: 200 }}
//                         className="bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a] border border-[#D4AF37]/30 rounded-2xl cursor-pointer overflow-hidden transition-shadow"
//                         onClick={() => handleProductClick(product.id)}
//                       >
//                         {/* Image */}
//                         <div className="relative w-full h-40 overflow-hidden">
//                           <img
//                             src={product.image}
//                             alt={product.name}
//                             className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
//                           />
//                         </div>
//                         {/* Info */}
//                         <div className="p-4">
//                           <h4 className="text-white font-semibold text-lg truncate">
//                             {product.name}
//                           </h4>
//                           <p className="text-[#D4AF37] font-bold mt-1">
//                             ${product.price}
//                           </p>
//                         </div>
//                       </motion.div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </motion.div>
//           )}
//         </motion.div>
//       </>
//     </AnimatePresence>
//   );
// }
