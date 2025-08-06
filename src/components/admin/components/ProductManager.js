// components/AddProductSection.jsx
"use client";
import { motion } from "framer-motion";
import { Plus, Minus, Image, Tag, Palette, Ruler, X, Upload } from "lucide-react";
import React, { useState, useRef } from "react";
import axios from "axios";
import ImageUpload from "./ImageUpload";
// Predefined options
import {toast} from "react-hot-toast";
const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
const COLOR_OPTIONS = [
  "Black", "White", "Red", "Blue", "Green", "Yellow", 
  "Purple", "Pink", "Gray", "Brown", "Navy", "Beige"
];

const AddProductSection = () => {
  const fileInputRef = useRef(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [productData, setProductData] = useState({
    title: "",
    description: "",
    images: [],
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (field, value) => {
    setProductData(prev => ({
      ...prev,
      [field]: Array.isArray(value) ? value : [value]
    }));
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('images', file);
      });

      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        }
      });

      const uploadedImages = response.data.urls.map(url => ({
        url,
        alt: `Product image ${productData.title}`
      }));

      setProductData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedImages]
      }));
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Image upload failed. Please try again.");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeImage = (index) => {
    setProductData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('/api/product', productData);
      console.log("Product added successfully:", response.data);
      alert("Product added successfully!");
      // Reset form or redirect as needed
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product. Please try again.");
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
         <div className="space-y-6 lg:col-span-2">
  <h3 className="text-lg font-semibold text-[#F6F5F3] border-b border-[#D4AF37] pb-2 flex items-center gap-2">
    <Image className="w-5 h-5" />
    Product Images
  </h3>
  
  <ImageUpload
  images={productData.images || []} // Add fallback empty array
  onChange={(newImages) => setProductData(prev => ({
    ...prev,
    images: newImages
  }))}
/>
</div>
          {/* <h3 className="text-lg font-semibold text-[#F6F5F3] border-b border-[#D4AF37] pb-2 flex items-center gap-2">
            <Image className="w-5 h-5" />
            Product Images
          </h3>
          
          <div className="space-y-4">
            {/* File Upload */}
            {/* <div className="border-2 border-dashed border-[#D4AF37]/50 rounded-lg p-6 text-center">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                multiple
                accept="image/*"
                className="hidden"
                disabled={isUploading}
              />
              <motion.button
                type="button"
                onClick={() => fileInputRef.current.click()}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="mx-auto flex flex-col items-center justify-center gap-2"
                disabled={isUploading}
              >
                <Upload className="w-8 h-8 text-[#D4AF37]" />
                <span className="text-[#F6F5F3] font-medium">
                  {isUploading ? 'Uploading...' : 'Click to upload images'}
                </span>
                <span className="text-sm text-[#F6F5F3]/70">
                  PNG, JPG, WEBP up to 10MB
                </span>
              </motion.button>
              
              {isUploading && (
                <div className="w-full bg-[#2E2E2E] rounded-full h-2.5 mt-4">
                  <div 
                    className="bg-[#D4AF37] h-2.5 rounded-full" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}
            </div>
            
            {/* Preview Uploaded Images */}
            {/* {productData.images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                {productData.images.map((image, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="relative group"
                  >
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <motion.button
                      type="button"
                      onClick={() => removeImage(index)}
                      whileHover={{ scale: 1.1 }}
                      className="absolute -top-2 -right-2 bg-[#5A1A17] text-[#F6F5F3] p-1 rounded-full"
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
                    <input
                      value={image.alt}
                      onChange={(e) => {
                        const newImages = [...productData.images];
                        newImages[index].alt = e.target.value;
                        setProductData(prev => ({ ...prev, images: newImages }));
                      }}
                      className="w-full mt-1 bg-[#2E2E2E] border border-[#D4AF37]/50 rounded px-2 py-1 text-xs text-[#F6F5F3] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                      placeholder="Image description"
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>*/}
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
              
              <select
                multiple
                value={productData.sizes}
                onChange={(e) => handleArrayChange("sizes", Array.from(e.target.selectedOptions, option => option.value))}
                className="w-full bg-[#2E2E2E] border border-[#D4AF37]/50 rounded-lg px-4 py-2 text-[#F6F5F3] focus:outline-none focus:ring-1 focus:ring-[#D4AF37] h-auto min-h-[42px]"
              >
                {SIZE_OPTIONS.map(size => (
                  <option 
                    key={size} 
                    value={size}
                    className="checked:bg-[#D4AF37] checked:text-[#0A0A0A]"
                  >
                    {size}
                  </option>
                ))}
              </select>
              <p className="text-xs text-[#F6F5F3]/70">
                Hold Ctrl/Cmd to select multiple sizes
              </p>
            </div>
            
            {/* Colors */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-[#F6F5F3] flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Available Colors
              </h4>
              
              <select
                multiple
                value={productData.colors}
                onChange={(e) => handleArrayChange("colors", Array.from(e.target.selectedOptions, option => option.value))}
                className="w-full bg-[#2E2E2E] border border-[#D4AF37]/50 rounded-lg px-4 py-2 text-[#F6F5F3] focus:outline-none focus:ring-1 focus:ring-[#D4AF37] h-auto min-h-[42px]"
              >
                {COLOR_OPTIONS.map(color => (
                  <option 
                    key={color} 
                    value={color}
                    className="checked:bg-[#D4AF37] checked:text-[#0A0A0A]"
                  >
                    {color}
                  </option>
                ))}
              </select>
              <p className="text-xs text-[#F6F5F3]/70">
                Hold Ctrl/Cmd to select multiple colors
              </p>
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
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    e.preventDefault();
                    setProductData(prev => ({
                      ...prev,
                      tags: [...prev.tags, e.target.value.trim()]
                    }));
                    e.target.value = '';
                  }
                }}
                className="flex-1 bg-[#2E2E2E] border border-[#D4AF37]/50 rounded-lg px-4 py-2 text-[#F6F5F3] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                placeholder="Type a tag and press Enter"
              />
              <motion.button
                type="button"
                onClick={() => {
                  const input = document.querySelector('input[type="text"][placeholder="Type a tag and press Enter"]');
                  if (input && input.value.trim()) {
                    setProductData(prev => ({
                      ...prev,
                      tags: [...prev.tags, input.value.trim()]
                    }));
                    input.value = '';
                  }
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-2 bg-[#D4AF37] text-[#0A0A0A] rounded-lg flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add
              </motion.button>
            </div>
            
            {productData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {productData.tags.map((tag, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-1 bg-[#2E2E2E] border border-[#D4AF37]/50 rounded-full px-3 py-1"
                  >
                    <span className="text-sm text-[#F6F5F3]">{tag}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setProductData(prev => ({
                          ...prev,
                          tags: prev.tags.filter((_, i) => i !== index)
                        }));
                      }}
                      className="text-[#F6F5F3] hover:text-[#D4AF37]"
                    >
                      <X className="w-3 h-3" />
                    </button>
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
            disabled={isUploading}
          >
            {isUploading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-[#0A0A0A]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
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