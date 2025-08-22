// // app/(dashboard)/categories/page.jsx
// "use client";
// import { useState, useEffect, useMemo } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { ChevronRight, ChevronDown, Edit3, PlusCircle, Trash2 } from "lucide-react";
// import CategoryModal from "@/components/main/CategoryModal";

// export default function CategoriesPage() {
//   const [categories, setCategories] = useState([]);
//   const [expanded, setExpanded] = useState({});
//   const [modalOpen, setModalOpen] = useState(false);
//   const [currentCategory, setCurrentCategory] = useState(null);
//   const [parentId, setParentId] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Build efficient children map
//   const childrenMap = useMemo(() => {
//     const map = {};
//     categories.forEach(cat => {
//       const key = cat.parent || "root";
//       if (!map[key]) map[key] = [];
//       map[key].push(cat);
//     });
//     return map;
//   }, [categories]);

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   async function fetchCategories() {
//     try {
//       const res = await fetch("/api/categories");
//       const { categories: data } = await res.json();
//       setCategories(data);
//     } catch (error) {
//       console.error("Failed to fetch categories:", error);
//     } finally {
//       setLoading(false);
//     }
//   }

//   function toggleExpand(id) {
//     setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
//   }

//   function handleAddSub(parentId) {
//     setParentId(parentId);
//     setCurrentCategory(null);
//     setModalOpen(true);
//   }

//   function handleEdit(category) {
//     setCurrentCategory(category);
//     setParentId(null);
//     setModalOpen(true);
//   }

//   async function handleDelete(id) {
//     if (!confirm("Delete this category and all its subcategories?")) return;
//     try {
//       await fetch(`/api/categories/${id}`, { method: "DELETE" });
//       fetchCategories();
//     } catch (error) {
//       console.error("Delete failed:", error);
//       alert("Failed to delete category");
//     }
//   }

//   function renderTree(parentId = "root", level = 0) {
//     const children = childrenMap[parentId] || [];

//     return children.map(cat => (
//       <motion.div 
//         key={cat._id}
//         initial={{ opacity: 0, y: -5 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.25 }}
//         className="ml-4 border-l-2 border-white/10 pl-4"
//       >
//         <motion.div 
//           whileHover={{ scale: 1.01 }}
//           className="flex items-center justify-between group rounded-lg border border-white/10 bg-[#121212] p-3 mt-2 shadow-sm hover:shadow-md transition-all"
//         >
//           <div className="flex items-center">
//             {childrenMap[cat._id]?.length > 0 && (
//               <button
//                 onClick={() => toggleExpand(cat._id)}
//                 className="mr-2 w-7 h-7 flex items-center justify-center rounded hover:bg-white/10 transition-colors"
//               >
//                 {expanded[cat._id] ? (
//                   <ChevronDown className="w-5 h-5 text-gray-300" />
//                 ) : (
//                   <ChevronRight className="w-5 h-5 text-gray-300" />
//                 )}
//               </button>
//             )}
//             <span
//               className={`font-medium text-base ${
//                 cat.status === "hidden" ? "text-gray-500" : "text-gray-100"
//               }`}
//             >
//               {cat.name}
//             </span>
//           </div>

//           <div className="flex space-x-2  group-hover:opacity-100 transition-opacity">
//             <button
//               onClick={() => handleEdit(cat)}
//               className="text-blue-400 hover:text-blue-500 p-1 rounded hover:bg-blue-500/10 transition-colors"
//             >
//               <Edit3 className="w-5 h-5" />
//             </button>
//             <button
//               onClick={() => handleAddSub(cat._id)}
//               className="text-green-400 hover:text-green-500 p-1 rounded hover:bg-green-500/10 transition-colors"
//             >
//               <PlusCircle className="w-5 h-5" />
//             </button>
//             <button
//               onClick={() => handleDelete(cat._id)}
//               className="text-red-400 hover:text-red-500 p-1 rounded hover:bg-red-500/10 transition-colors"
//             >
//               <Trash2 className="w-5 h-5" />
//             </button>
//           </div>
//         </motion.div>

//         <AnimatePresence>
//           {expanded[cat._id] && (
//             <motion.div
//               initial={{ height: 0, opacity: 0 }}
//               animate={{ height: "auto", opacity: 1 }}
//               exit={{ height: 0, opacity: 0 }}
//               transition={{ duration: 0.3 }}
//             >
//               {renderTree(cat._id, level + 1)}
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </motion.div>
//     ));
//   }

//   if (loading) {
//     return (
//       <div className="p-6 bg-[#0A0A0A] min-h-screen">
//         <div className="flex justify-center items-center h-64">
//           <span className="text-lg font-medium text-gray-300 animate-pulse">
//             Loading categories...
//           </span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-[#0A0A0A] text-white w-full min-h-screen">
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
//         <div>
//           <motion.h1
//             initial={{ y: -20, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             className="text-3xl md:text-4xl font-extrabold text-[#D4AF37] mb-2"
//           >
//             Category Management
//           </motion.h1>
//           <motion.p
//             initial={{ y: -10, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             transition={{ delay: 0.1 }}
//             className="text-gray-400"
//           >
//             Organize, track, and manage all your categories in one place.
//           </motion.p>
          
//         </div>
//         <button
//           onClick={() => {
//             setParentId(null);
//             setCurrentCategory(null);
//             setModalOpen(true);
//           }}
//           className="mt-4 md:mt-0 px-5 py-2 flex items-center space-x-2 bg-[#D4AF37] text-white rounded-lg hover:bg-[#D4AF37] cursor-pointer  shadow hover:shadow-lg transition-all"
//         >
//           <PlusCircle className="w-5 h-5" />
//           <span className="font-medium">Add Root Category</span>
//         </button>
//       </div>
// <motion.div
//             initial={{ width: 0 }}
//             animate={{ width: "100%" }}
//             transition={{ delay: 0.2, duration: 0.8 }}
//             className="h-1 bg-gradient-to-r  from-[#D4AF37] to-transparent rounded my-3"
//           />
//       <div className="bg-[#1A1A1A] border border-white/10 rounded-lg shadow-md p-4 min-h-[500px] transition-all hover:border-[#D4AF37]">
//         {categories.length > 0 ? (
//           renderTree()
//         ) : (
//           <div className="flex flex-col items-center justify-center text-center py-16 text-gray-400">
//             <p className="text-lg font-medium">No categories found</p>
//             <button
//               onClick={() => setModalOpen(true)}
//               className="mt-6 px-4 py-2 flex items-center space-x-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow"
//             >
//               <PlusCircle className="w-5 h-5" />
//               <span>Create your first category</span>
//             </button>
//           </div>
//         )}
//       </div>

//       <CategoryModal
//         open={modalOpen}
//         onClose={() => setModalOpen(false)}
//         onSuccess={fetchCategories}
//         category={currentCategory}
//         parentId={parentId}
//         categories={categories}
//       />
//     </div>
//   );
// }

import React from 'react'

const Page = () => {
  return (
    <div className='w-full h-screen flex items-center justify-center text-3xl text-[#D4AF37] font-semibold'>this page is underconstruction please visit later ! </div>
  )
}

export default Page 