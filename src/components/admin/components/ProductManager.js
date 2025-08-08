// components/AddProductSection.jsx
"use client";
import { motion } from "framer-motion";
import { Plus, Minus, Image, Tag, Palette, Ruler, X, Upload } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import ImageUpload from "./ImageUpload";
import { toast } from "react-hot-toast";

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
const COLOR_OPTIONS = [
  "Black", "White", "Red", "Blue", "Green", "Yellow", 
  "Purple", "Pink", "Gray", "Brown", "Navy", "Beige"
];

const AddProductSection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productData, setProductData] = useState({
    title: "",
    description: "",
    price: 0,
    discountPrice: 0,
    inStock: true,
    stockQuantity: 0,
    category: "",
    subcategory: "",
    sizes: [],
    colors: [],
    tags: [],
    slug: "",
    isFeatured: false,
    isArchived: false
  });

  // Store images as File objects locally
  const [imageFiles, setImageFiles] = useState([]);

  // Reset form function
  const resetForm = () => {
    setProductData({
      title: "",
      description: "",
      price: 0,
      discountPrice: 0,
      inStock: true,
      stockQuantity: 0,
      category: "",
      subcategory: "",
      sizes: [],
      colors: [],
      tags: [],
      slug: "",
      isFeatured: false,
      isArchived: false
    });
    setImageFiles([]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData(prev => ({ ...prev, [name]: value }));
  };

  // Handle size toggle
  const toggleSize = (size) => {
    setProductData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size) 
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  // Handle color toggle
  const toggleColor = (color) => {
    setProductData(prev => ({
      ...prev,
      colors: prev.colors.includes(color) 
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color]
    }));
  };

  // Handle tag addition
  const addTag = (tag) => {
    if (tag.trim() && !productData.tags.includes(tag.trim())) {
      setProductData(prev => ({
        ...prev,
        tags: [...prev.tags, tag.trim()]
      }));
    }
  };

  // Handle tag removal
  const removeTag = (index) => {
    setProductData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  // Upload images when product is submitted
  const uploadImages = async (files) => {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    
    try {
      const response = await axios.post('/api/upload', formData);
      return response.data.images; // array of {url, fileId}
    } catch (error) {
      console.error('Image upload failed:', error);
      toast.error('Failed to upload images');
      return [];
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // 1. Upload images first
      let uploadedImages = [];
      if (imageFiles.length > 0) {
        uploadedImages = await uploadImages(imageFiles);
      }

      // 2. Create product with image URLs
      const productPayload = {
        ...productData,
        images: uploadedImages
      };

      const response = await axios.post('/api/product', productPayload);
      
      if (response.data.success) {
        toast.success("Product added successfully!");
        resetForm();
      }
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-[#0A0A0A] p-8 rounded-xl border border-[#D4AF37] shadow-lg"
    >
      <div className="flex items-center justify-between mb-8">
        <motion.h2 
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          className="text-2xl font-bold text-[#D4AF37] flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add New Product
        </motion.h2>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-[#F6F5F3] border-b border-[#D4AF37] pb-2">
            Basic Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#F6F5F3] mb-1">Product Title*</label>
              <input
                name="title"
                value={productData.title}
                onChange={handleInputChange}
                className="w-full bg-[#2E2E2E] border border-[#D4AF37]/50 rounded-lg px-4 py-2 text-[#F6F5F3] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                placeholder="e.g., Premium Leather Jacket"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#F6F5F3] mb-1">Slug*</label>
              <input
                name="slug"
                value={productData.slug}
                onChange={handleInputChange}
                className="w-full bg-[#2E2E2E] border border-[#D4AF37]/50 rounded-lg px-4 py-2 text-[#F6F5F3] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                placeholder="e.g., premium-leather-jacket"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#F6F5F3] mb-1">Description*</label>
            <textarea
              name="description"
              value={productData.description}
              onChange={handleInputChange}
              className="w-full bg-[#2E2E2E] border border-[#D4AF37]/50 rounded-lg px-4 py-2 text-[#F6F5F3] focus:outline-none focus:ring-1 focus:ring-[#D4AF37] min-h-[120px]"
              placeholder="Detailed product description..."
              required
            />
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-[#F6F5F3] border-b border-[#D4AF37] pb-2">
            Pricing & Inventory
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-[#F6F5F3] mb-1">Price*</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#D4AF37]">$</span>
              <input
                name="price"
                type="number"
                value={productData.price}
                onChange={handleInputChange}
                className="w-full bg-[#2E2E2E] border border-[#D4AF37]/50 rounded-lg pl-8 pr-4 py-2 text-[#F6F5F3] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#F6F5F3] mb-1">Discount Price</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#D4AF37]">$</span>
              <input
                name="discountPrice"
                type="number"
                value={productData.discountPrice}
                onChange={handleInputChange}
                className="w-full bg-[#2E2E2E] border border-[#D4AF37]/50 rounded-lg pl-8 pr-4 py-2 text-[#F6F5F3] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-[#F6F5F3] mb-1">Stock Quantity*</label>
              <input
                name="stockQuantity"
                type="number"
                value={productData.stockQuantity}
                onChange={handleInputChange}
                className="w-full bg-[#2E2E2E] border border-[#D4AF37]/50 rounded-lg px-4 py-2 text-[#F6F5F3] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                placeholder="0"
                min="0"
                required
              />
            </div>
            
            <div className="flex items-center gap-2 mt-6">
              <input
                type="checkbox"
                id="inStock"
                name="inStock"
                checked={productData.inStock}
                onChange={(e) => setProductData(prev => ({...prev, inStock: e.target.checked}))}
                className="h-5 w-5 rounded border-[#D4AF37] bg-[#2E2E2E] text-[#D4AF37] focus:ring-[#D4AF37]"
              />
              <label htmlFor="inStock" className="text-sm font-medium text-[#F6F5F3]">
                In Stock
              </label>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-[#F6F5F3] border-b border-[#D4AF37] pb-2">
            Categories
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-[#F6F5F3] mb-1">Main Category*</label>
            <select
              name="category"
              value={productData.category}
              onChange={handleInputChange}
              className="w-full bg-[#2E2E2E] border border-[#D4AF37]/50 rounded-lg px-4 py-2 text-[#F6F5F3] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
              required
            >
              <option value="">Select Category</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#F6F5F3] mb-1">Subcategory*</label>
            <select
              name="subcategory"
              value={productData.subcategory}
              onChange={handleInputChange}
              className="w-full bg-[#2E2E2E] border border-[#D4AF37]/50 rounded-lg px-4 py-2 text-[#F6F5F3] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
              required
            >
              <option value="">Select Subcategory</option>
              <option value="Shoes">Shoes</option>
              <option value="Shirts">Shirts</option>
              <option value="Jeans">Jeans</option>
              <option value="Bags">Bags</option>
              <option value="Sunglasses">Sunglasses</option>
              <option value="Caps">Caps</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>
        </div>

        {/* Images */}
        <div className="space-y-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-[#F6F5F3] border-b border-[#D4AF37] pb-2 flex items-center gap-2">
            <Image className="w-5 h-5" />
            Product Images
          </h3>
          
          <ImageUpload
            images={imageFiles}
            onChange={setImageFiles}
          />
        </div>  

        {/* Variants */}
        <div className="space-y-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-[#F6F5F3] border-b border-[#D4AF37] pb-2">
            Product Variants
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sizes */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-[#F6F5F3] flex items-center gap-2">
                <Ruler className="w-4 h-4" />
                Available Sizes
              </h4>
              
              <div className="flex flex-wrap gap-2">
                {SIZE_OPTIONS.map(size => (
                  <motion.button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      productData.sizes.includes(size)
                        ? 'bg-[#D4AF37] text-[#0A0A0A] border-[#D4AF37]'
                        : 'bg-[#2E2E2E] text-[#F6F5F3] border-[#D4AF37]/50 hover:border-[#D4AF37]'
                    }`}
                  >
                    {size}
                  </motion.button>
                ))}
              </div>
              
              {productData.sizes.length > 0 && (
                <div className="text-xs text-[#F6F5F3]/70">
                  Selected: {productData.sizes.join(', ')}
                </div>
              )}
            </div>
            
            {/* Colors */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-[#F6F5F3] flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Available Colors
              </h4>
              
              <div className="flex flex-wrap gap-2">
                {COLOR_OPTIONS.map(color => (
                  <motion.button
                    key={color}
                    type="button"
                    onClick={() => toggleColor(color)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
                      productData.colors.includes(color)
                        ? 'bg-[#D4AF37] text-[#0A0A0A] border-[#D4AF37]'
                        : 'bg-[#2E2E2E] text-[#F6F5F3] border-[#D4AF37]/50 hover:border-[#D4AF37]'
                    }`}
                  >
                    {color}
                  </motion.button>
                ))}
              </div>
              
              {productData.colors.length > 0 && (
                <div className="text-xs text-[#F6F5F3]/70">
                  Selected: {productData.colors.join(', ')}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-[#F6F5F3] border-b border-[#D4AF37] pb-2 flex items-center gap-2">
            <Tag className="w-5 h-5" />
            Product Tags
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                id="tagInput"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    e.preventDefault();
                    addTag(e.target.value);
                    e.target.value = '';
                  }
                }}
                className="flex-1 bg-[#2E2E2E] border w-[100px] border-[#D4AF37]/50 rounded-lg px-4 py-2 text-[#F6F5F3] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                placeholder="Type a tag"
              />
              <motion.button
                type="button"
                onClick={() => {
                  const input = document.getElementById('tagInput');
                  if (input && input.value.trim()) {
                    addTag(input.value);
                    input.value = '';
                  }
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-[#D4AF37] text-[#0A0A0A] rounded-lg flex items-center gap-1 font-medium"
              >
                <Plus className="w-4 h-4" />
                Add
              </motion.button>
            </div>
            
            {productData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {productData.tags.map((tag, index) => (
                  <motion.div
                    key={`${tag}-${index}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-2 bg-[#2E2E2E] border border-[#D4AF37]/50 rounded-full px-3 py-1"
                  >
                    <span className="text-sm text-[#F6F5F3]">{tag}</span>
                    <motion.button
                      type="button"
                      onClick={() => removeTag(index)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-[#F6F5F3] hover:text-[#D4AF37] transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Status */}
        <div className="space-y-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-[#F6F5F3] border-b border-[#D4AF37] pb-2">
            Product Status
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isFeatured"
                name="isFeatured"
                checked={productData.isFeatured}
                onChange={(e) => setProductData(prev => ({...prev, isFeatured: e.target.checked}))}
                className="h-5 w-5 rounded border-[#D4AF37] bg-[#2E2E2E] text-[#D4AF37] focus:ring-[#D4AF37]"
              />
              <label htmlFor="isFeatured" className="text-sm font-medium text-[#F6F5F3]">
                Featured Product
              </label>
            </div>
            
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isArchived"
                name="isArchived"
                checked={productData.isArchived}
                onChange={(e) => setProductData(prev => ({...prev, isArchived: e.target.checked}))}
                className="h-5 w-5 rounded border-[#D4AF37] bg-[#2E2E2E] text-[#D4AF37] focus:ring-[#D4AF37]"
              />
              <label htmlFor="isArchived" className="text-sm font-medium text-[#F6F5F3]">
                Archived (Hide from store)
              </label>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <motion.div 
          className="lg:col-span-2 pt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-[#D4AF37] text-[#0A0A0A] font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-[#C9A227] transition-colors flex items-center justify-center gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-b-2 border-[#0A0A0A] rounded-full animate-spin"></div>
                Adding...
              </div>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Add Product
              </>
            )}
          </motion.button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default AddProductSection;
// // components/AddProductSection.jsx
// "use client";
// import { motion } from "framer-motion";
// import { Plus, Minus, Image, Tag, Palette, Ruler, X, Upload } from "lucide-react";
// import React, { useState, useRef } from "react";
// import axios from "axios";
// import ImageUpload from "./ImageUpload";
// // Predefined options
// import {toast} from "react-hot-toast";

// const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
// const COLOR_OPTIONS = [
//   "Black", "White", "Red", "Blue", "Green", "Yellow", 
//   "Purple", "Pink", "Gray", "Brown", "Navy", "Beige"
// ];

// const AddProductSection = () => {
//   const fileInputRef = useRef(null);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [isUploading, setIsUploading] = useState(false);
//   const [productData, setProductData] = useState({
//     title: "",
//     description: "",
//     images: [],
//     price: 0,
//     discountPrice: 0,
//     inStock: true,
//     stockQuantity: 0,
//     category: "",
//     subcategory: "",
//     sizes: [],
//     colors: [],
//     tags: [],
//     slug: "",
//     isFeatured: false,
//     isArchived: false
//   });

//   // Reset form function
//   const resetForm = () => {
//     setProductData({
//       title: "",
//       description: "",
//       images: [],
//       price: 0,
//       discountPrice: 0,
//       inStock: true,
//       stockQuantity: 0,
//       category: "",
//       subcategory: "",
//       sizes: [],
//       colors: [],
//       tags: [],
//       slug: "",
//       isFeatured: false,
//       isArchived: false
//     });
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setProductData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleArrayChange = (field, value) => {
//     setProductData(prev => ({
//       ...prev,
//       [field]: Array.isArray(value) ? value : [value]
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     try {
//       const response = await axios.post('/api/product', productData);
//       console.log("Product added successfully:", response.data);
//       console.log(productData,"this is the [product data that i was talking aboyt")
//       if (response.data.success) {
//         toast.success("Product added successfully!");
//         resetForm(); // Reset form on success
//       }
//     } catch (error) {
//       console.error("Error adding product:", error);
//       toast.error("Failed to add product. Please try again.");
//     }
//   };

//   // Handle size toggle
//   const toggleSize = (size) => {
//     setProductData(prev => ({
//       ...prev,
//       sizes: prev.sizes.includes(size) 
//         ? prev.sizes.filter(s => s !== size)
//         : [...prev.sizes, size]
//     }));
//   };

//   // Handle color toggle
//   const toggleColor = (color) => {
//     setProductData(prev => ({
//       ...prev,
//       colors: prev.colors.includes(color) 
//         ? prev.colors.filter(c => c !== color)
//         : [...prev.colors, color]
//     }));
//   };

//   // Handle tag addition
//   const addTag = (tag) => {
//     if (tag.trim() && !productData.tags.includes(tag.trim())) {
//       setProductData(prev => ({
//         ...prev,
//         tags: [...prev.tags, tag.trim()]
//       }));
//     }
//   };

//   // Handle tag removal
//   const removeTag = (index) => {
//     setProductData(prev => ({
//       ...prev,
//       tags: prev.tags.filter((_, i) => i !== index)
//     }));
//   };

//   return (
//     <motion.div 
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//       className="w-full bg-[#0A0A0A] p-8 rounded-xl border border-[#D4AF37] shadow-lg"
//     >
//       <div className="flex items-center justify-between mb-8">
//         <motion.h2 
//           initial={{ x: -20 }}
//           animate={{ x: 0 }}
//           className="text-2xl font-bold text-[#D4AF37] flex items-center gap-2"
//         >
//           <Plus className="w-5 h-5" />
//           Add New Product
//         </motion.h2>
//       </div>

//       <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Basic Information */}
//         <div className="space-y-6 lg:col-span-2">
//           <h3 className="text-lg font-semibold text-[#F6F5F3] border-b border-[#D4AF37] pb-2">
//             Basic Information
//           </h3>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-[#F6F5F3] mb-1">Product Title*</label>
//               <input
//                 name="title"
//                 value={productData.title}
//                 onChange={handleInputChange}
//                 className="w-full bg-[#2E2E2E] border border-[#D4AF37]/50 rounded-lg px-4 py-2 text-[#F6F5F3] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
//                 placeholder="e.g., Premium Leather Jacket"
//                 required
//               />
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-[#F6F5F3] mb-1">Slug*</label>
//               <input
//                 name="slug"
//                 value={productData.slug}
//                 onChange={handleInputChange}
//                 className="w-full bg-[#2E2E2E] border border-[#D4AF37]/50 rounded-lg px-4 py-2 text-[#F6F5F3] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
//                 placeholder="e.g., premium-leather-jacket"
//                 required
//               />
//             </div>
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-[#F6F5F3] mb-1">Description*</label>
//             <textarea
//               name="description"
//               value={productData.description}
//               onChange={handleInputChange}
//               className="w-full bg-[#2E2E2E] border border-[#D4AF37]/50 rounded-lg px-4 py-2 text-[#F6F5F3] focus:outline-none focus:ring-1 focus:ring-[#D4AF37] min-h-[120px]"
//               placeholder="Detailed product description..."
//               required
//             />
//           </div>
//         </div>

//         {/* Pricing & Inventory */}
//         <div className="space-y-6">
//           <h3 className="text-lg font-semibold text-[#F6F5F3] border-b border-[#D4AF37] pb-2">
//             Pricing & Inventory
//           </h3>
          
//           <div>
//             <label className="block text-sm font-medium text-[#F6F5F3] mb-1">Price*</label>
//             <div className="relative">
//               <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#D4AF37]">$</span>
//               <input
//                 name="price"
//                 type="number"
//                 value={productData.price}
//                 onChange={handleInputChange}
//                 className="w-full bg-[#2E2E2E] border border-[#D4AF37]/50 rounded-lg pl-8 pr-4 py-2 text-[#F6F5F3] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
//                 placeholder="0.00"
//                 min="0"
//                 step="0.01"
//                 required
//               />
//             </div>
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-[#F6F5F3] mb-1">Discount Price</label>
//             <div className="relative">
//               <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#D4AF37]">$</span>
//               <input
//                 name="discountPrice"
//                 type="number"
//                 value={productData.discountPrice}
//                 onChange={handleInputChange}
//                 className="w-full bg-[#2E2E2E] border border-[#D4AF37]/50 rounded-lg pl-8 pr-4 py-2 text-[#F6F5F3] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
//                 placeholder="0.00"
//                 min="0"
//                 step="0.01"
//               />
//             </div>
//           </div>
          
//           <div className="flex items-center justify-between">
//             <div>
//               <label className="block text-sm font-medium text-[#F6F5F3] mb-1">Stock Quantity*</label>
//               <input
//                 name="stockQuantity"
//                 type="number"
//                 value={productData.stockQuantity}
//                 onChange={handleInputChange}
//                 className="w-full bg-[#2E2E2E] border border-[#D4AF37]/50 rounded-lg px-4 py-2 text-[#F6F5F3] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
//                 placeholder="0"
//                 min="0"
//                 required
//               />
//             </div>
            
//             <div className="flex items-center gap-2 mt-6">
//               <input
//                 type="checkbox"
//                 id="inStock"
//                 name="inStock"
//                 checked={productData.inStock}
//                 onChange={(e) => setProductData(prev => ({...prev, inStock: e.target.checked}))}
//                 className="h-5 w-5 rounded border-[#D4AF37] bg-[#2E2E2E] text-[#D4AF37] focus:ring-[#D4AF37]"
//               />
//               <label htmlFor="inStock" className="text-sm font-medium text-[#F6F5F3]">
//                 In Stock
//               </label>
//             </div>
//           </div>
//         </div>

//         {/* Categories */}
//         <div className="space-y-6">
//           <h3 className="text-lg font-semibold text-[#F6F5F3] border-b border-[#D4AF37] pb-2">
//             Categories
//           </h3>
          
//           <div>
//             <label className="block text-sm font-medium text-[#F6F5F3] mb-1">Main Category*</label>
//             <select
//               name="category"
//               value={productData.category}
//               onChange={handleInputChange}
//               className="w-full bg-[#2E2E2E] border border-[#D4AF37]/50 rounded-lg px-4 py-2 text-[#F6F5F3] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
//               required
//             >
//               <option value="">Select Category</option>
//               <option value="Men">Men</option>
//               <option value="Women">Women</option>
//               <option value="Kids">Kids</option>
//             </select>
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-[#F6F5F3] mb-1">Subcategory*</label>
//             <select
//               name="subcategory"
//               value={productData.subcategory}
//               onChange={handleInputChange}
//               className="w-full bg-[#2E2E2E] border border-[#D4AF37]/50 rounded-lg px-4 py-2 text-[#F6F5F3] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
//               required
//             >
//               <option value="">Select Subcategory</option>
//               <option value="Shoes">Shoes</option>
//               <option value="Shirts">Shirts</option>
//               <option value="Jeans">Jeans</option>
//               <option value="Bags">Bags</option>
//               <option value="Sunglasses">Sunglasses</option>
//               <option value="Caps">Caps</option>
//               <option value="Accessories">Accessories</option>
//             </select>
//           </div>
//         </div>

//         {/* Images */}
//         <div className="space-y-6 lg:col-span-2">
//           <h3 className="text-lg font-semibold text-[#F6F5F3] border-b border-[#D4AF37] pb-2 flex items-center gap-2">
//             <Image className="w-5 h-5" />
//             Product Images
//           </h3>
          
//           <ImageUpload
//             images={productData.images || []}
            
//             onChange={(newImages) => setProductData(prev => ({
//               ...prev,
//               images: newImages
//             }))}
//           />
//         </div>  

//         {/* Variants */}
//         <div className="space-y-6 lg:col-span-2">
//           <h3 className="text-lg font-semibold text-[#F6F5F3] border-b border-[#D4AF37] pb-2">
//             Product Variants
//           </h3>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Sizes */}
//             <div className="space-y-4">
//               <h4 className="text-sm font-medium text-[#F6F5F3] flex items-center gap-2">
//                 <Ruler className="w-4 h-4" />
//                 Available Sizes
//               </h4>
              
//               <div className="flex flex-wrap gap-2">
//                 {SIZE_OPTIONS.map(size => (
//                   <motion.button
//                     key={size}
//                     type="button"
//                     onClick={() => toggleSize(size)}
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     className={`px-4 py-2 rounded-lg border transition-colors ${
//                       productData.sizes.includes(size)
//                         ? 'bg-[#D4AF37] text-[#0A0A0A] border-[#D4AF37]'
//                         : 'bg-[#2E2E2E] text-[#F6F5F3] border-[#D4AF37]/50 hover:border-[#D4AF37]'
//                     }`}
//                   >
//                     {size}
//                   </motion.button>
//                 ))}
//               </div>
              
//               {productData.sizes.length > 0 && (
//                 <div className="text-xs text-[#F6F5F3]/70">
//                   Selected: {productData.sizes.join(', ')}
//                 </div>
//               )}
//             </div>
            
//             {/* Colors */}
//             <div className="space-y-4">
//               <h4 className="text-sm font-medium text-[#F6F5F3] flex items-center gap-2">
//                 <Palette className="w-4 h-4" />
//                 Available Colors
//               </h4>
              
//               <div className="flex flex-wrap gap-2">
//                 {COLOR_OPTIONS.map(color => (
//                   <motion.button
//                     key={color}
//                     type="button"
//                     onClick={() => toggleColor(color)}
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
//                       productData.colors.includes(color)
//                         ? 'bg-[#D4AF37] text-[#0A0A0A] border-[#D4AF37]'
//                         : 'bg-[#2E2E2E] text-[#F6F5F3] border-[#D4AF37]/50 hover:border-[#D4AF37]'
//                     }`}
//                   >
//                     {color}
//                   </motion.button>
//                 ))}
//               </div>
              
//               {productData.colors.length > 0 && (
//                 <div className="text-xs text-[#F6F5F3]/70">
//                   Selected: {productData.colors.join(', ')}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Tags */}
//         <div className="space-y-6 lg:col-span-2">
//           <h3 className="text-lg font-semibold text-[#F6F5F3] border-b border-[#D4AF37] pb-2 flex items-center gap-2">
//             <Tag className="w-5 h-5" />
//             Product Tags
//           </h3>
          
//           <div className="space-y-4">
//             <div className="flex items-center gap-2">
//               <input
//                 type="text"
//                 id="tagInput"
//                 onKeyDown={(e) => {
//                   if (e.key === 'Enter' && e.target.value.trim()) {
//                     e.preventDefault();
//                     addTag(e.target.value);
//                     e.target.value = '';
//                   }
//                 }}
//                 className="flex-1 bg-[#2E2E2E] border border-[#D4AF37]/50 rounded-lg px-4 py-2 text-[#F6F5F3] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
//                 placeholder="Type a tag and press Enter"
//               />
//               <motion.button
//                 type="button"
//                 onClick={() => {
//                   const input = document.getElementById('tagInput');
//                   if (input && input.value.trim()) {
//                     addTag(input.value);
//                     input.value = '';
//                   }
//                 }}
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="px-4 py-2 bg-[#D4AF37] text-[#0A0A0A] rounded-lg flex items-center gap-1 font-medium"
//               >
//                 <Plus className="w-4 h-4" />
//                 Add
//               </motion.button>
//             </div>
            
//             {productData.tags.length > 0 && (
//               <div className="flex flex-wrap gap-2">
//                 {productData.tags.map((tag, index) => (
//                   <motion.div
//                     key={`${tag}-${index}`}
//                     initial={{ opacity: 0, scale: 0.8 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     exit={{ opacity: 0, scale: 0.8 }}
//                     className="flex items-center gap-2 bg-[#2E2E2E] border border-[#D4AF37]/50 rounded-full px-3 py-1"
//                   >
//                     <span className="text-sm text-[#F6F5F3]">{tag}</span>
//                     <motion.button
//                       type="button"
//                       onClick={() => removeTag(index)}
//                       whileHover={{ scale: 1.1 }}
//                       whileTap={{ scale: 0.9 }}
//                       className="text-[#F6F5F3] hover:text-[#D4AF37] transition-colors"
//                     >
//                       <X className="w-3 h-3" />
//                     </motion.button>
//                   </motion.div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Status */}
//         <div className="space-y-6 lg:col-span-2">
//           <h3 className="text-lg font-semibold text-[#F6F5F3] border-b border-[#D4AF37] pb-2">
//             Product Status
//           </h3>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="flex items-center gap-3">
//               <input
//                 type="checkbox"
//                 id="isFeatured"
//                 name="isFeatured"
//                 checked={productData.isFeatured}
//                 onChange={(e) => setProductData(prev => ({...prev, isFeatured: e.target.checked}))}
//                 className="h-5 w-5 rounded border-[#D4AF37] bg-[#2E2E2E] text-[#D4AF37] focus:ring-[#D4AF37]"
//               />
//               <label htmlFor="isFeatured" className="text-sm font-medium text-[#F6F5F3]">
//                 Featured Product
//               </label>
//             </div>
            
//             <div className="flex items-center gap-3">
//               <input
//                 type="checkbox"
//                 id="isArchived"
//                 name="isArchived"
//                 checked={productData.isArchived}
//                 onChange={(e) => setProductData(prev => ({...prev, isArchived: e.target.checked}))}
//                 className="h-5 w-5 rounded border-[#D4AF37] bg-[#2E2E2E] text-[#D4AF37] focus:ring-[#D4AF37]"
//               />
//               <label htmlFor="isArchived" className="text-sm font-medium text-[#F6F5F3]">
//                 Archived (Hide from store)
//               </label>
//             </div>
//           </div>
//         </div>

//         {/* Submit Button */}
//         <motion.div 
//           className="lg:col-span-2 pt-6"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//         >
//           <motion.button
//             type="submit"
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//             className="w-full bg-[#D4AF37] text-[#0A0A0A] font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-[#C9A227] transition-colors flex items-center justify-center gap-2"
//             disabled={isUploading}
//           >
//             <Plus className="w-5 h-5" />
//             Add Product
//           </motion.button>
//         </motion.div>
//       </form>
//     </motion.div>
//   );
// };

// export default AddProductSection;
