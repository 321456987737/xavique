"use client";
import { motion } from "framer-motion";
import { Search, Save, X, Image as ImageIcon, Trash2, Loader2, ChevronDown, Check, Plus } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
// Predefined options
const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
const COLOR_OPTIONS = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Red", hex: "#FF0000" },
  { name: "Blue", hex: "#0000FF" },
  { name: "Green", hex: "#008000" },
  { name: "Yellow", hex: "#FFFF00" },
  { name: "Purple", hex: "#800080" },
  { name: "Pink", hex: "#FFC0CB" },
  { name: "Gray", hex: "#808080" },
  { name: "Brown", hex: "#A52A2A" },
  { name: "Navy", hex: "#000080" },
  { name: "Beige", hex: "#F5F5DC" }
];
const CATEGORIES = ["Men", "Women", "Kids"];
const SUBCATEGORIES = ["Shoes", "Shirts", "Jeans", "Bags", "Sunglasses", "Caps", "Accessories"];

const EditProduct = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showSizes, setShowSizes] = useState(false);
  const [showColors, setShowColors] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const fileInputRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // Debounced search
  const debouncedSearch = useCallback(async (term) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await axios.get(`/api/products?search=${term}`);
      setSearchResults(response.data);
      setShowSearchResults(true);
    } catch (error) {
      toast.error("Error searching for products");
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Handle search term changes with debounce
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      debouncedSearch(searchTerm);
    }, 450); // 450ms debounce delay

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm, debouncedSearch]);

  // Select product from search results
  const selectProduct = (product) => {
    setProduct({
      ...product,
      // Ensure arrays exist
      sizes: product.sizes || [],
      colors: product.colors || [],
      tags: product.tags || [],
      images: product.images || []
    });
    setSearchTerm("");
    setSearchResults([]);
    setShowSearchResults(false);
    setActiveTab("basic");
  };

  // Handle image upload
const handleImageUpload = async (e) => {
  const files = Array.from(e.target.files);
  if (!files.length || !product) return;

  setIsUploading(true);
  try {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    console.log(1)
    const uploadResponse = await axios.post('/api/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    console.log(2)
    if (uploadResponse.data.success) {
      const newImages = uploadResponse.data.images.map(img => ({
        url: img.url,
        _id: img._id,  // Make sure to use fileId
        thumbnailUrl: img.thumbnailUrl,
        alt: `Product image ${product.title}`
      }));
      console.log(3);
      setProduct(prev => ({ 
        ...prev, 
        images: [...prev.images, ...newImages] 
      }));
        console.log(4)
      // Immediately update the product in database
      await axios.put(`/api/products/${product._id}`, {
        images: [...product.images, ...newImages]
      });
      
      toast.success("Images added successfully");
    } else {
      throw new Error(uploadResponse.data.error || 'Upload failed');
    }
  } catch (error) {
    toast.error(error.message || "Failed to upload images");
    console.error('Upload error:', error);
  } finally {
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }
};

// Remove single image
const removeImage = async (id) => {
  if (!product || !id) return;
  
  try {
    // First delete from ImageKit
    await axios.post('/api/delete-images', { 
      _id: [id]  // Make sure to send fileIds array
    });

    // Then update local state and database
    const updatedImages = product.images.filter(img => img._id !== id);

    setProduct(prev => ({
      ...prev,
      images: updatedImages
    }));
    
    // Update database
    await axios.put(`/api/products/${product._id}`, {
      images: updatedImages
    });
    
    toast.success("Image removed successfully");
  } catch (error) {
    console.error('Failed to remove image:', error);
    toast.error("Failed to remove image");
  }
};

// Remove all images
const removeAllImages = async () => {
  if (!product?.images?.length) return;

  try {
    const _id = product.images.map(img => img._id);
    
    // First delete from ImageKit
    await axios.post('/api/delete-images', { 
      _id: _id  // Make sure to send fileIds array
    });
    
    // Then update local state and database
    setProduct(prev => ({ ...prev, images: [] }));
    
    // Update database
    await axios.put(`/api/products/${product._id}`, {
      images: []
    });
    
    toast.success("All images removed");
  } catch (error) {
    console.error('Failed to remove images:', error);
    toast.error("Failed to remove images");
  }
};
  // Handle image upload
//   const handleImageUpload = async (e) => {
//     const files = Array.from(e.target.files);
//     if (!files.length || !product) return;

//     setIsUploading(true);
//     try {
//       const formData = new FormData();
//       files.forEach(file => formData.append('images', file));

//       const uploadResponse = await axios.post('/api/upload', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       });

//       const newImages = uploadResponse.data.images.map(img => ({
//         url: img.url,
//         fileId: img.fileId,
//         alt: `Product image ${product.title}`
//       }));

//       setProduct(prev => ({ 
//         ...prev, 
//         images: [...prev.images, ...newImages] 
//       }));
//       toast.success("Images added successfully");
//     } catch (error) {
//       toast.error("Failed to upload images");
//       console.error(error);
//     } finally {
//       setIsUploading(false);
//       if (fileInputRef.current) fileInputRef.current.value = "";
//     }
//   };

//   // Remove single image
//   // Update the removeImage function
// const removeImage = async (imageId) => {
//   if (!product || !imageId) return;
  
//   try {
//     await axios.post('/api/delete-images', { 
//       _id: [imageId] 
//     });

//     setProduct(prev => ({
//       ...prev,
//       images: prev.images.filter(img => img._id !== imageId)
//     }));
    
//     toast.success("Image removed successfully");
//   } catch (error) {
//     console.error('Failed to remove image:', error);
//     toast.error("Failed to remove image");
//   }
// };

// // Update the removeAllImages function
// const removeAllImages = async () => {
//   if (!product?.images?.length) return;

//   try {
//     const imageIds = product.images.map(img => img._id);
//     await axios.post('/api/delete-images', { 
//       _id: imageIds 
//     });
    
//     setProduct(prev => ({ ...prev, images: [] }));
//     toast.success("All images removed");
//   } catch (error) {
//     console.error('Failed to remove images:', error);
//     toast.error("Failed to remove images");
//   }
// };

  // Save changes
  const handleSave = async (e) => {
    e.preventDefault();
    if (!product) return;

    setIsLoading(true);
    try {
      const response = await axios.put(`/api/products/${product._id}`, product);
      setProduct(response.data);
      toast.success("Product updated successfully!");
    } catch (error) {
      toast.error("Failed to update product");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  // Toggle size selection
  const toggleSize = (size) => {
    setProduct(prev => {
      const newSizes = prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size];
      return { ...prev, sizes: newSizes };
    });
  };

  // Toggle color selection
  const toggleColor = (color) => {
    setProduct(prev => {
      const newColors = prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color];
      return { ...prev, colors: newColors };
    });
  };

  // Add new tag
  const addTag = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault();
      const input = e.target.tagName === 'INPUT' ? e.target : 
        document.querySelector('input[name="newTag"]');
      const value = input.value.trim();
      
      if (value && !product.tags.includes(value)) {
        setProduct(prev => ({ ...prev, tags: [...prev.tags, value] }));
        input.value = '';
      }
    }
  };

  // Remove tag
  const removeTag = (tagToRemove) => {
    setProduct(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Generate slug from title
  const generateSlug = () => {
    if (!product?.title) return;
    const slug = product.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setProduct(prev => ({ ...prev, slug }));
  };

  const handleDelete = async (productId) => {
  const confirm = window.confirm("Are you sure you want to delete this product?");
  if (!confirm) return;

  try {
    const res = await fetch(`/api/products/${productId}`, {
      method: "DELETE",
    });
    console.log(res)
    if (res.data.ok || res.ok || res.status === 200 || res.status >=200 <= 299) {
      setProduct(!product);
    }
  } catch (err) {
    console.error("Delete failed", err);
  }
};

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full bg-[#0A0A0A] p-6 my-8 rounded-xl border border-[#222] shadow-lg"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#D4AF37]">Edit Product</h2>
        {product && (
          <div className="flex items-center gap-2 text-sm text-[#888]">
            <span>Product ID:</span>
            <span className="font-mono bg-[#222] px-2 py-1 rounded">{product._id}</span>
          </div>
        )}
      </div>
      
      {/* Search Form */}
      <div className="relative mb-8 bg-[#111] p-4 rounded-lg">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by product name, ID or SKU..."
            className="w-full bg-[#222] border border-[#333] rounded-lg px-4 py-3 pl-10 text-[#F6F5F3] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D4AF37]" />
          {isSearching && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D4AF37] animate-spin" />
          )}
        </div>

        {/* Search Results Dropdown */}
        {showSearchResults && searchResults.length > 0 && (
          <div className="absolute z-10 mt-2 w-full bg-[#222] border border-[#333] rounded-lg shadow-lg max-h-80 overflow-y-auto">
            {searchResults.map((result) => (
              <div
                key={result._id}
                onClick={() => selectProduct(result)}
                className="p-3 hover:bg-[#333] cursor-pointer transition-colors flex items-center gap-3"
              >
                {result.images?.[0]?.url && (
                  <img
                    src={`${result.images[0].url}?tr=w-100,h-100`}
                    alt={result.title}
                    className="w-10 h-10 object-cover rounded"
                  />
                )}
                <div>
                  <p className="text-[#F6F5F3] font-medium">{result.title}</p>
                  <p className="text-xs text-[#888]">ID: {result._id} {result.sku && `| SKU: ${result.sku}`}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {product ? (
        <div className="bg-[#111] rounded-lg overflow-hidden">
          {/* Navigation Tabs */}
          <div className="border-b border-[#222]">
            <nav className="flex -mb-px items-center ">
              <button
                onClick={() => setActiveTab("basic")}
                className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors ${activeTab === "basic" ? "border-[#D4AF37] text-[#D4AF37]" : "border-transparent text-[#888] hover:text-[#D4AF37]"}`}
              >
                Basic Info
              </button>
              <button
                onClick={() => setActiveTab("media")}
                className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors ${activeTab === "media" ? "border-[#D4AF37] text-[#D4AF37]" : "border-transparent text-[#888] hover:text-[#D4AF37]"}`}
              >
                Media
              </button>
              <button
                onClick={() => setActiveTab("inventory")}
                className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors ${activeTab === "inventory" ? "border-[#D4AF37] text-[#D4AF37]" : "border-transparent text-[#888] hover:text-[#D4AF37]"}`}
              >
                Inventory
              </button>
              <button
                onClick={() => setActiveTab("organization")}
                className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors ${activeTab === "organization" ? "border-[#D4AF37] text-[#D4AF37]" : "border-transparent text-[#888] hover:text-[#D4AF37]"}`}
              >
                Organization
              </button>
              <button
  onClick={()=>handleDelete(product._id)}
  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded "
>
  Delete Product
</button>

            </nav>
          </div>

          <form onSubmit={handleSave} className="p-6">
            {/* Basic Information Tab */}
            {activeTab === "basic" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#F6F5F3] mb-2">Product Name*</label>
                    <input
                      name="title"
                      value={product.title}
                      onChange={handleChange}
                      className="w-full bg-[#222] border border-[#333] rounded-lg px-4 py-3 text-[#F6F5F3] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all"
                      required
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-[#F6F5F3]">Slug*</label>
                      <button
                        type="button"
                        onClick={generateSlug}
                        className="text-xs text-[#D4AF37] hover:underline"
                      >
                        Generate from title
                      </button>
                    </div>
                    <input
                      name="slug"
                      value={product.slug}
                      onChange={handleChange}
                      className="w-full bg-[#222] border border-[#333] rounded-lg px-4 py-3 text-[#F6F5F3] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#F6F5F3] mb-2">Description*</label>
                  <textarea
                    name="description"
                    value={product.description}
                    onChange={handleChange}
                    className="w-full bg-[#222] border border-[#333] rounded-lg px-4 py-3 text-[#F6F5F3] min-h-[150px] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#F6F5F3] mb-2">Price*</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#D4AF37]">$</span>
                      <input
                        name="price"
                        type="number"
                        value={product.price}
                        onChange={handleChange}
                        className="w-full bg-[#222] border border-[#333] rounded-lg pl-10 pr-4 py-3 text-[#F6F5F3] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#F6F5F3] mb-2">Discount Price</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#D4AF37]">$</span>
                      <input
                        name="discountPrice"
                        type="number"
                        value={product.discountPrice || ""}
                        onChange={handleChange}
                        className="w-full bg-[#222] border border-[#333] rounded-lg pl-10 pr-4 py-3 text-[#F6F5F3] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all"
                        min="0"
                        step="0.01"
                        placeholder="Optional"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Media Tab */}
            {activeTab === "media" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium text-[#F6F5F3]">Product Images</h3>
                    <p className="text-sm text-[#888]">Upload high-quality product images</p>
                  </div>
                  {product.images?.length > 0 && (
                    <button
                      type="button"
                      onClick={removeAllImages}
                      className="text-sm text-red-500 hover:text-red-400 flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove All
                    </button>
                  )}
                </div>
                
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      multiple
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current.click()}
                      disabled={isUploading}
                      className="bg-[#222] border-2 border-dashed border-[#D4AF37] text-[#D4AF37] px-6 py-4 rounded-lg flex flex-col items-center gap-2 hover:bg-[#1a1a1a] transition-colors disabled:opacity-50 w-full"
                    >
                      {isUploading ? (
                        <Loader2 className="animate-spin w-6 h-6" />
                      ) : (
                        <>
                          <ImageIcon className="w-8 h-8" />
                          <span className="font-medium">Click to upload or drag and drop</span>
                          <span className="text-sm text-[#888]">PNG, JPG, GIF up to 10MB</span>
                        </>
                      )}
                    </button>
                  </div>

                  {product.images?.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {product.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square overflow-hidden rounded-lg bg-[#222]">
                            <img
                              src={`${image.url}?tr=w-300,h-300`}
                              alt={image.alt}
                              className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(image._id)}
                            className="absolute top-2 right-2 bg-[#5A1A17] text-[#F6F5F3] p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <input
                            value={image.alt}
                            onChange={(e) => {
                              const newImages = [...product.images];
                              newImages[index].alt = e.target.value;
                              setProduct(prev => ({ ...prev, images: newImages }));
                            }}
                            placeholder="Image description"
                            className="w-full mt-2 bg-[#222] border border-[#333] rounded px-3 py-2 text-sm text-[#F6F5F3] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Inventory Tab */}
            {activeTab === "inventory" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#F6F5F3] mb-2">Stock Quantity*</label>
                    <input
                      name="stockQuantity"
                      type="number"
                      value={product.stockQuantity}
                      onChange={handleChange}
                      className="w-full bg-[#222] border border-[#333] rounded-lg px-4 py-3 text-[#F6F5F3] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all"
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Sizes */}
                  <div>
                    <label className="block text-sm font-medium text-[#F6F5F3] mb-2">Available Sizes</label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowSizes(!showSizes)}
                        className="w-full bg-[#222] border border-[#333] rounded-lg px-4 py-3 text-left flex justify-between items-center hover:bg-[#1a1a1a] transition-colors"
                      >
                        <span className={product.sizes.length ? "text-[#F6F5F3]" : "text-[#888]"}>
                          {product.sizes.length > 0 
                            ? product.sizes.join(", ") 
                            : "Select sizes"}
                        </span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${showSizes ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {showSizes && (
                        <div className="absolute z-10 mt-1 w-full bg-[#222] border border-[#333] rounded-lg shadow-lg p-2 grid grid-cols-3 gap-2 max-h-60 overflow-y-auto">
                          {SIZE_OPTIONS.map(size => (
                            <button
                              key={size}
                              type="button"
                              onClick={() => toggleSize(size)}
                              className={`px-3 py-2 rounded text-sm flex items-center gap-2 justify-center ${
                                product.sizes.includes(size)
                                  ? 'bg-[#D4AF37] text-[#0A0A0A] font-medium'
                                  : 'bg-[#222] text-[#F6F5F3] hover:bg-[#333]'
                              }`}
                            >
                              {product.sizes.includes(size) && <Check className="w-3 h-3" />}
                              {size}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Colors */}
                  <div>
                    <label className="block text-sm font-medium text-[#F6F5F3] mb-2">Available Colors</label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowColors(!showColors)}
                        className="w-full bg-[#222] border border-[#333] rounded-lg px-4 py-3 text-left flex justify-between items-center hover:bg-[#1a1a1a] transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          {product.colors.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {product.colors.slice(0, 3).map(color => {
                                const colorObj = COLOR_OPTIONS.find(c => c.name === color);
                                return (
                                  <div 
                                    key={color}
                                    className="w-4 h-4 rounded-full border border-[#444]"
                                    style={{ backgroundColor: colorObj?.hex || '#333' }}
                                    title={color}
                                  />
                                );
                              })}
                              {product.colors.length > 3 && (
                                <span className="text-xs text-[#888]">+{product.colors.length - 3} more</span>
                              )}
                            </div>
                          ) : (
                            <span className="text-[#888]">Select colors</span>
                          )}
                        </div>
                        <ChevronDown className={`w-4 h-4 transition-transform ${showColors ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {showColors && (
                        <div className="absolute z-10 mt-1 w-full bg-[#222] border border-[#333] rounded-lg shadow-lg p-3 grid grid-cols-3 gap-3 max-h-60 overflow-y-auto">
                          {COLOR_OPTIONS.map(color => (
                            <button
                              key={color.name}
                              type="button"
                              onClick={() => toggleColor(color.name)}
                              className={`px-3 py-2 rounded text-sm flex items-center gap-2 ${
                                product.colors.includes(color.name)
                                  ? 'ring-2 ring-[#D4AF37]'
                                  : 'hover:bg-[#333]'
                              }`}
                            >
                              <div 
                                className="w-4 h-4 rounded-full border border-[#444]"
                                style={{ backgroundColor: color.hex }}
                              />
                              <span className={product.colors.includes(color.name) ? "text-[#D4AF37]" : "text-[#F6F5F3]"}>
                                {color.name}
                              </span>
                              {product.colors.includes(color.name) && <Check className="w-3 h-3 ml-auto" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Organization Tab */}
            {activeTab === "organization" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#F6F5F3] mb-2">Category*</label>
                    <select
                      name="category"
                      value={product.category}
                      onChange={handleChange}
                      className="w-full bg-[#222] border border-[#333] rounded-lg px-4 py-3 text-[#F6F5F3] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all appearance-none"
                      required
                    >
                      <option value="">Select Category</option>
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#F6F5F3] mb-2">Subcategory*</label>
                    <select
                      name="subcategory"
                      value={product.subcategory}
                      onChange={handleChange}
                      className="w-full bg-[#222] border border-[#333] rounded-lg px-4 py-3 text-[#F6F5F3] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all appearance-none"
                      required
                    >
                      <option value="">Select Subcategory</option>
                      {SUBCATEGORIES.map(sub => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-[#F6F5F3] mb-2">Product Tags</label>
                  <p className="text-sm text-[#888] mb-3">Add tags to help customers find your product</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {product.tags.map((tag,index) => (
                      <div key={index} className="bg-[#222] border border-[#333] rounded-full px-3 py-1 flex items-center gap-1">
                        <span className="text-sm text-[#F6F5F3]">{tag}</span>
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-[#888] hover:text-[#D4AF37] transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="newTag"
                      placeholder="Add new tag (press Enter)"
                      onKeyDown={addTag}
                      className="flex-1 bg-[#222] border border-[#333] rounded-lg px-4 py-2 text-[#F6F5F3] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all"
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="bg-[#D4AF37] text-[#0A0A0A] px-4 py-2 rounded-lg hover:bg-[#C9A227] transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  </div>
                </div>

                {/* Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <div className="flex items-center gap-3 p-3 bg-[#222] rounded-lg">
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        id="isFeatured"
                        name="isFeatured"
                        checked={product.isFeatured}
                        onChange={(e) => setProduct(prev => ({ ...prev, isFeatured: e.target.checked }))}
                        className="h-4 w-4 rounded border-[#D4AF37] bg-[#333] text-[#D4AF37] focus:ring-[#D4AF37]"
                      />
                    </div>
                    <div>
                      <label htmlFor="isFeatured" className="text-sm font-medium text-[#F6F5F3]">
                        Featured Product
                      </label>
                      <p className="text-xs text-[#888]">Show this product in featured sections</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-[#222] rounded-lg">
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        id="isArchived"
                        name="isArchived"
                        checked={product.isArchived}
                        onChange={(e) => setProduct(prev => ({ ...prev, isArchived: e.target.checked }))}
                        className="h-4 w-4 rounded border-[#D4AF37] bg-[#333] text-[#D4AF37] focus:ring-[#D4AF37]"
                      />
                    </div>
                    <div>
                      <label htmlFor="isArchived" className="text-sm font-medium text-[#F6F5F3]">
                        Archived
                      </label>
                      <p className="text-xs text-[#888]">Hide this product from your store</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button - Fixed at bottom */}
            <div className="sticky bottom-0 bg-[#111] py-4 border-t border-[#222] mt-8 -mx-6 px-6">
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setProduct(null)}
                  className="bg-transparent border border-[#333] text-[#F6F5F3] px-6 py-2 rounded-lg hover:bg-[#222] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-[#D4AF37] text-[#0A0A0A] px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-[#C9A227] disabled:opacity-50 transition-colors font-medium"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <div className="text-center py-12 text-[#F6F5F3] bg-[#111] rounded-lg">
          <div className="mx-auto w-24 h-24 bg-[#222] rounded-full flex items-center justify-center mb-6">
            <Search className="w-10 h-10 text-[#D4AF37]" />
          </div>
          <h3 className="text-xl font-medium mb-2">Find a product to edit</h3>
          <p className="text-[#888] max-w-md mx-auto">
            Search for a product by name, ID or SKU to begin editing its details.
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default EditProduct;