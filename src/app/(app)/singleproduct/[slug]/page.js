"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import Extracards from "@/components/main/displayextracards/extracards";
import { useCartStore } from "@/store/cartStore";
import {
  Star,
  Heart,
  ShoppingCart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Truck,
  RefreshCw,
  Check,
  Package,
  Ruler,
  CreditCard,
  Shield,
  X,
  ZoomIn,
  Award,
  Clock,
  Users,
  MessageCircle,
  ArrowRight,
} from "lucide-react";

export default function SingleProductPage() {
  const addToCart = useCartStore((state) => state.addToCart);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  
  const router = useRouter();
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pre-select first available options
  useEffect(() => {
    if (product) {
      if (product.colors?.length > 0 && !selectedColor) {
        setSelectedColor(product.colors[0]);
      }
      if (product.sizes?.length > 0 && !selectedSize) {
        setSelectedSize(product.sizes[0]);
      }
    }
  }, [product, selectedColor, selectedSize]);

  const handleAddToCart = useCallback(() => {
    if (!product) return;
    
    // Validate selections based on available options
    if (product.colors?.length > 0 && !selectedColor) {
      alert("Please select color");
      return;
    }
    if (product.sizes?.length > 0 && !selectedSize) {
      alert("Please select size");
      return;
    }

    addToCart(
      product, 
      quantity, 
      { 
        color: selectedColor || "N/A", 
        size: selectedSize || "N/A" 
      }
    );
  }, [product, quantity, selectedColor, selectedSize, addToCart]);

  const handleBuyNow = useCallback(() => {
    handleAddToCart();
    router.push("/cart");
  }, [handleAddToCart, router]);

  const fetchProduct = useCallback(async () => {
    if (!slug) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const res = await axios.get(`/api/getsingalproducts/${slug}`);
      
      if (!res.data.success) {
        throw new Error("Failed to fetch product");
      }
      
      const data = res.data.product;
      setProduct(data);
      setIsLoading(false);
    } catch (err) {
      console.error("Product fetch error:", err);
      setError("Failed to load product. Please try again later.");
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  // Navigation functions
  const nextImage = useCallback(() => {
    if (product?.images?.length) {
      setCurrentImageIndex(prev => (prev + 1) % product.images.length);
    }
  }, [product]);

  const prevImage = useCallback(() => {
    if (product?.images?.length) {
      setCurrentImageIndex(prev => 
        (prev - 1 + product.images.length) % product.images.length
      );
    }
  }, [product]);

  const nextModalImage = useCallback(() => {
    if (product?.images?.length) {
      setModalImageIndex(prev => (prev + 1) % product.images.length);
    }
  }, [product]);

  const prevModalImage = useCallback(() => {
    if (product?.images?.length) {
      setModalImageIndex(prev => 
        (prev - 1 + product.images.length) % product.images.length
      );
    }
  }, [product]);

  const handleImageClick = useCallback((index) => {
    setModalImageIndex(index);
    setShowImageModal(true);
  }, []);

  // Quantity handlers
  const incrementQuantity = useCallback(() => {
    setQuantity(prev => Math.min(prev + 1, product?.stockQuantity || 10));
  }, [product]);

  const decrementQuantity = useCallback(() => {
    setQuantity(prev => Math.max(prev - 1, 1));
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] p-4 pt-[120px] flex items-center justify-center">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Image Skeleton */}
            <div className="flex justify-center">
              <div className="w-full max-w-md aspect-square bg-[#1a1a1a] animate-pulse rounded-lg"></div>
            </div>

            {/* Details Skeleton */}
            <div className="space-y-4">
              <div className="h-8 bg-[#1a1a1a] animate-pulse rounded w-3/4"></div>
              <div className="h-6 bg-[#1a1a1a] animate-pulse rounded w-1/3"></div>
              <div className="space-y-2">
                <div className="h-4 bg-[#1a1a1a] animate-pulse rounded w-full"></div>
                <div className="h-4 bg-[#1a1a1a] animate-pulse rounded w-5/6"></div>
                <div className="h-4 bg-[#1a1a1a] animate-pulse rounded w-2/3"></div>
              </div>
              <div className="h-12 bg-[#1a1a1a] animate-pulse rounded-md w-40 mt-4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A0A0A] p-4">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-semibold text-[#D4AF37] mb-4">
            Product Loading Error
          </h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button 
            onClick={fetchProduct}
            className="bg-gradient-to-r from-[#D4AF37] to-[#D4AF37]/20 text-white font-medium py-2 px-6 rounded-lg flex items-center justify-center"
          >
            <RefreshCw size={18} className="mr-2" /> Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A0A0A] p-4">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-semibold text-[#D4AF37] mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-300 mb-6">
            The product you re looking for doesn t exist or has been removed.
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-gradient-to-r from-[#D4AF37] to-[#D4AF37]/20 text-white font-medium py-2 px-6 rounded-lg"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  // Image Modal Component
  const ImageModal = () => (
    showImageModal && (
      <div
        className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
        onClick={() => setShowImageModal(false)}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowImageModal(false);
          }}
          className="absolute top-6 right-6 text-white/70 hover:text-[#D4AF37] z-50 transition-colors p-2 hover:bg-[#D4AF37]/10 rounded-full"
          aria-label="Close image modal"
        >
          <X size={28} />
        </button>

        <div 
          className="relative max-w-5xl max-h-full w-full bg-[#0A0A0A]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative bg-[#0A0A0A] rounded-lg overflow-hidden shadow-2xl">
            <Image
              src={product.images[modalImageIndex]?.url}
              alt={`${product.title} ${modalImageIndex + 1}`}
              width={800}
              height={800}
              className="w-full h-auto max-h-[80vh] object-contain"
            />

            {product.images.length > 1 && (
              <>
                <button
                  onClick={prevModalImage}
                  className="absolute left-4 top-1/2 text-white transform -translate-y-1/2 bg-[#D4AF37]/20 hover:bg-[#D4AF37]/80 rounded-full p-3 shadow-lg transition-all hover:scale-105"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={nextModalImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-[#D4AF37]/20 hover:bg-[#D4AF37]/80 text-white rounded-full p-3 shadow-lg transition-all hover:scale-105"
                  aria-label="Next image"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
              {product.images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setModalImageIndex(index);
                  }}
                  className={`w-3 h-3 rounded-full transition-all ${
                    modalImageIndex === index
                      ? "bg-white scale-125"
                      : "bg-white/60 hover:bg-white/80"
                  }`}
                  aria-label={`View image ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  );

  return (
    <>
      <div className="min-h-screen bg-[#0A0A0A] text-white">
        {/* Desktop Layout */}
        <div className="pt-32 justify-center hidden md:flex gap-4 lg:gap-12">
          {/* Left Side - Full Height Images */}
          <div className="max-w-[600px] lg:w-[35%] w-[45%] gap-6 h-full flex flex-col">
            {product.images.map((img, index) => (
              <div
                key={img.id || index}
                className="h-[80vh] border border-[#D4AF37] relative rounded-md cursor-pointer group overflow-hidden bg-[#0A0A0A] hover:text-[#D4AF37] transition-all"
                onClick={() => handleImageClick(index)}
              >
                <Image
                  src={img.url}
                  alt={`${product.title} ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-102"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />

                {/* Premium overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-[#0A0A0A]/95 text-white hover:text-[#D4AF37] backdrop-blur-sm rounded-full p-4 transform scale-90 group-hover:scale-100 transition-transform duration-300 shadow-xl">
                      <ZoomIn size={28} />
                    </div>
                  </div>
                </div>

                {/* Premium badges on first image */}
                {index === 0 && (
                  <div className="absolute top-8 left-8 flex flex-col gap-3">
                    {product.isFeatured && (
                      <div className="bg-gradient-to-r from-[#D4AF37] to-[#C9A227] text-white px-4 py-2 rounded-full flex items-center shadow-lg backdrop-blur-sm">
                        <Award size={16} className="mr-2" />
                        <span className="font-semibold text-sm tracking-wide">
                          FEATURED
                        </span>
                      </div>
                    )}
                    {product.discountPrice && (
                      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full shadow-lg backdrop-blur-sm">
                        <span className="font-bold text-sm tracking-wide">
                          {Math.round(
                            100 - (product.discountPrice / product.price) * 100
                          )}
                          % OFF
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Side - Product Details */}
          <div className="sticky top-0 h-full max-w-[600px] lg:w-[35%] w-[45%]">
            <div className="py-8 px-5 xl:p-12">
              {/* Breadcrumbs */}
              <nav className="text-xs text-gray-400 mb-6 flex items-center">
                <span 
                  onClick={() => router.push("/")}
                  className="cursor-pointer hover:text-[#D4AF37] transition-colors"
                >
                  Home
                </span>
                <ChevronRight size={12} className="mx-2" />
                <span 
                  onClick={() => router.push(`/category/${product.category}`)}
                  className="cursor-pointer hover:text-[#D4AF37] transition-colors"
                >
                  {product.category}
                </span>
                <ChevronRight size={12} className="mx-2" />
                <span 
                  onClick={() => router.push(`/category/${product.category}/${product.subcategory}`)}
                  className="cursor-pointer hover:text-[#D4AF37] transition-colors"
                >
                  {product.subcategory}
                </span>
                <ChevronRight size={12} className="mx-2" />
                <span className="font-medium text-white truncate max-w-[150px]">
                  {product.title}
                </span>
              </nav>

              {/* Title + Rating */}
              <div className="mb-6">
                <h1 className="text-2xl xl:text-3xl font-bold text-white mb-3 leading-snug">
                  {product.title}
                </h1>
                <div className="flex items-center gap-3">
                  <div className="flex items-center">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          fill="currentColor"
                          className={
                            i < 4 ? "text-amber-400" : "text-gray-600"
                          }
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-gray-400 font-medium text-sm">
                      4.8
                    </span>
                  </div>
                  <div className="h-3 w-px bg-gray-600"></div>
                  <button className="flex items-center gap-1 text-sm text-gray-400 hover:text-[#D4AF37] transition-colors">
                    <MessageCircle size={14} />
                    <span className="font-medium">128 Reviews</span>
                  </button>
                </div>
              </div>

              {/* Price */}
              <div className="mb-6 p-4 rounded-xl border border-[#D4AF37]">
                <div className="flex items-baseline gap-3 mb-2">
                  {product.discountPrice ? (
                    <>
                      <span className="text-2xl font-bold text-white">
                        ${product.discountPrice.toFixed(2)}
                      </span>
                      <span className="text-lg text-red-500 line-through">
                        ${product.price.toFixed(2)}
                      </span>
                      <span className="bg-green-900 text-green-300 px-2 py-0.5 rounded-full text-xs font-semibold">
                        Save $
                        {(product.price - product.discountPrice).toFixed(2)}
                      </span>
                    </>
                  ) : (
                    <span className="text-2xl font-bold text-white">
                      ${product.price.toFixed(2)}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center text-green-500">
                    <Check size={14} className="mr-1" /> In Stock
                  </div>
                  <div className="flex items-center text-gray-400">
                    <Package size={14} className="mr-1" />{" "}
                    {product.stockQuantity} Available
                  </div>
                  <div className="flex items-center text-gray-400">
                    <Clock size={14} className="mr-1" /> Ships Today
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                {product.description ||
                  "Expertly crafted with premium materials for the perfect balance of style and functionality."}
              </p>

              {/* Colors */}
              {product.colors?.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-md font-semibold text-white">
                      Color
                    </h3>
                    {selectedColor && (
                      <span className="text-xs text-gray-400 capitalize">
                        {selectedColor}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color, index) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-9 h-9 rounded-full border-2 relative transition-all ${
                          selectedColor === color
                            ? "border-[#D4AF37] scale-105 shadow-md"
                            : "border-gray-500 hover:border-[#D4AF37]"
                        }`}
                        style={{ backgroundColor: color.toLowerCase() }}
                        title={color}
                        aria-label={`Select color: ${color}`}
                        aria-pressed={selectedColor === color}
                      >
                        {selectedColor === color && (
                          <div className="absolute inset-0 rounded-full flex items-center justify-center">
                            <Check
                              size={14}
                              className="text-white drop-shadow-sm"
                            />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {product.sizes?.length > 0 && (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-semibold text-white">
                      Size
                    </h3>
                    <button className="text-xs text-gray-400 hover:text-[#D4AF37] font-medium flex items-center">
                      <Ruler size={14} className="mr-1" /> Size Guide
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-2 px-2 rounded-lg border text-xs font-semibold transition-all ${
                          selectedSize === size
                            ? "border-[#D4AF37] bg-[#D4AF37]/20 text-white shadow"
                            : "border-gray-600 hover:border-[#D4AF37] bg-[#0A0A0A]"
                        }`}
                        aria-pressed={selectedSize === size}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity + Add to Cart */}
              <div className="mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-gray-600 rounded-lg overflow-hidden">
                    <button
                      onClick={decrementQuantity}
                      className="px-3 py-2 border-r border-gray-600 hover:bg-[#D4AF37]/10"
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      <Minus
                        size={16}
                        className={
                          quantity <= 1 ? "text-gray-600" : "text-[#D4AF37]"
                        }
                      />
                    </button>
                    <span className="px-4 py-2 font-semibold text-sm text-white">
                      {quantity}
                    </span>
                    <button
                      onClick={incrementQuantity}
                      className="px-3 py-2 border-l border-gray-600 hover:bg-[#D4AF37]/10"
                      disabled={quantity >= product.stockQuantity}
                      aria-label="Increase quantity"
                    >
                      <Plus
                        size={16}
                        className={
                          quantity >= product.stockQuantity
                            ? "text-gray-600"
                            : "text-[#D4AF37]"
                        }
                      />
                    </button>
                  </div>

                  <button 
                    onClick={handleAddToCart}
                    className="flex-1 bg-gradient-to-r from-[#D4AF37] to-[#D4AF37]/20 border border-[#D4AF37] text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center transition-all hover:shadow-lg hover:shadow-[#D4AF37]/30 duration-300 text-sm"
                  >
                    <ShoppingCart size={18} className="mr-2" /> Add to Cart
                  </button>
                </div>
                <div>
                  <button 
                    onClick={handleBuyNow}
                    className="flex-1 bg-gradient-to-r from-[#D4AF37]/10 to-[#D4AF37] border border-[#D4AF37] text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center w-full mt-5 transition-all hover:shadow-lg hover:shadow-[#D4AF37]/30 duration-300 text-sm"
                  >
                    <ShoppingCart size={18} className="mr-2" /> Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden pt-20">
          {/* Mobile Carousel */}
          <div className="relative">
            <div className="aspect-square w-full relative overflow-hidden bg-[#0A0A0A]">
              {product.images.length > 0 && (
                <Image
                  src={product.images[currentImageIndex].url}
                  alt={`${product.title} ${currentImageIndex + 1}`}
                  fill
                  className="object-cover"
                  onClick={() => handleImageClick(currentImageIndex)}
                />
              )}

              {product.images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black text-white rounded-full p-2 shadow-lg"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black text-white rounded-full p-2 shadow-lg"
                    aria-label="Next image"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              {/* Premium badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                {product.isFeatured && (
                  <div className="bg-gradient-to-r from-[#D4AF37] to-[#C9A227] text-white px-3 py-1 rounded-full flex items-center text-xs font-semibold">
                    <Award size={12} className="mr-1" />
                    FEATURED
                  </div>
                )}
                {product.discountPrice && (
                  <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                    {Math.round(
                      100 - (product.discountPrice / product.price) * 100
                    )}
                    % OFF
                  </div>
                )}
              </div>

              {/* Image counter */}
              <div className="absolute bottom-3 right-3 bg-[#D4AF37]/70 text-white px-3 py-1.5 rounded-full text-xs font-medium">
                {currentImageIndex + 1} / {product.images.length}
              </div>
            </div>

            {/* Dots indicator */}
            {product.images.length > 1 && (
              <div className="flex justify-center mt-3 gap-2">
                {product.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      currentImageIndex === index
                        ? "bg-[#D4AF37] scale-125"
                        : "bg-[#D4AF37]/50 hover:bg-[#D4AF37] hover:scale-125"
                    }`}
                    aria-label={`View image ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Mobile Product Details */}
          <div className="p-5 sm:p-6">
            {/* Breadcrumbs */}
            <nav className="text-sm mb-4 flex items-center overflow-x-auto">
              <span 
                onClick={() => router.push("/")}
                className="cursor-pointer whitespace-nowrap text-gray-400 hover:text-[#D4AF37] px-2 py-1 rounded transition-colors"
              >
                Home
              </span>
              <ChevronRight
                size={12}
                className="mx-2 text-gray-400"
              />
              <span 
                onClick={() => router.push(`/category/${product.category}`)}
                className="cursor-pointer whitespace-nowrap text-gray-400 hover:text-[#D4AF37] px-2 py-1 rounded transition-colors"
              >
                {product.category}
              </span>
              <ChevronRight
                size={12}
                className="mx-2 text-gray-400"
              />
              <span 
                onClick={() => router.push(`/category/${product.category}/${product.subcategory}`)}
                className="cursor-pointer whitespace-nowrap text-gray-400 hover:text-[#D4AF37] px-2 py-1 rounded transition-colors"
              >
                {product.subcategory}
              </span>
              <ChevronRight
                size={12}
                className="mx-2 text-gray-400"
              />
              <span className="font-medium text-white truncate max-w-[150px]">
                {product.title}
              </span>
            </nav>

            {/* Title and Rating */}
            <div className="mb-5">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                {product.title}
              </h1>
              <div className="flex items-center gap-3">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill="currentColor"
                      className={i < 4 ? "text-amber-400" : "text-gray-600"}
                    />
                  ))}
                </div>
                <span className="text-gray-400 text-sm">
                  4.8 (128 reviews)
                </span>
              </div>
            </div>

            {/* Pricing */}
            <div className="mb-6 p-4 border border-[#D4AF37] rounded-xl">
              <div className="flex items-baseline gap-3 mb-2">
                {product.discountPrice ? (
                  <>
                    <span className="text-3xl font-bold text-white">
                      ${product.discountPrice.toFixed(2)}
                    </span>
                    <span className="text-xl text-red-500 line-through">
                      ${product.price.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-white">
                      ${product.price.toFixed(2)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center text-green-500">
                  <Check size={14} className="mr-1" />
                  <span className="font-medium">In Stock</span>
                </div>
                <div className="text-gray-400">
                  {product.stockQuantity} Available
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              {product.description ||
                "Expertly crafted with premium materials for the perfect balance of style and functionality."}
            </p>

            {/* Colors */}
            {product.colors?.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-md font-semibold text-white">
                    Color
                  </h3>
                  {selectedColor && (
                    <span className="text-xs text-gray-400 capitalize">
                      {selectedColor}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-9 h-9 rounded-full border-2 relative ${
                        selectedColor === color
                          ? "border-[#D4AF37] scale-105 shadow-md"
                          : "border-gray-500 hover:border-[#D4AF37]"
                      }`}
                      style={{ backgroundColor: color.toLowerCase() }}
                      title={color}
                      aria-label={`Select color: ${color}`}
                      aria-pressed={selectedColor === color}
                    >
                      {selectedColor === color && (
                        <div className="absolute inset-0 rounded-full flex items-center justify-center">
                          <Check
                            size={14}
                            className="text-white drop-shadow-sm"
                          />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes?.length > 0 && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-semibold text-white">
                    Size
                  </h3>
                  <button className="text-xs text-gray-400 hover:text-[#D4AF37] font-medium flex items-center">
                    <Ruler size={14} className="mr-1" /> Size Guide
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 px-2 rounded-lg border text-xs font-semibold transition-all ${
                        selectedSize === size
                          ? "border-[#D4AF37] bg-[#D4AF37]/20 text-white shadow"
                          : "border-gray-600 hover:border-[#D4AF37] bg-[#0A0A0A]"
                      }`}
                      aria-pressed={selectedSize === size}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Add to Cart */}
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-gray-600 rounded-lg overflow-hidden">
                  <button
                    onClick={decrementQuantity}
                    className="px-3 py-2 border-r border-gray-600 hover:bg-[#D4AF37]/10"
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    <Minus
                      size={16}
                      className={
                        quantity <= 1 ? "text-gray-600" : "text-[#D4AF37]"
                      }
                    />
                  </button>
                  <span className="px-4 py-2 font-semibold text-sm text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={incrementQuantity}
                    className="px-3 py-2 border-l border-gray-600 hover:bg-[#D4AF37]/10"
                    disabled={quantity >= product.stockQuantity}
                    aria-label="Increase quantity"
                  >
                    <Plus
                      size={16}
                      className={
                        quantity >= product.stockQuantity
                          ? "text-gray-600"
                          : "text-[#D4AF37]"
                      }
                    />
                  </button>
                </div>

                <button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-gradient-to-r from-[#D4AF37] to-[#D4AF37]/20 border border-[#D4AF37] text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center transition-all hover:shadow-lg hover:shadow-[#D4AF37]/30 duration-300 text-sm"
                >
                  <ShoppingCart size={18} className="mr-2" /> Add to Cart
                </button>
              </div>
              <div>
                <button 
                  onClick={handleBuyNow}
                  className="flex-1 bg-gradient-to-r from-[#D4AF37]/10 to-[#D4AF37] border border-[#D4AF37] text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center w-full mt-5 transition-all hover:shadow-lg hover:shadow-[#D4AF37]/30 duration-300 text-sm"
                >
                  <ShoppingCart size={18} className="mr-2" /> Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Related Products */}
      <div className="bg-[#0A0A0A] pb-20">
        <div className="text-white text-2xl font-semibold mb-8 pt-16 text-center"> 
          {product.subcategory} Collection
        </div>
        <Extracards 
          category={product.category} 
          subcategory={product.subcategory} 
          currentproductid={product._id}
        />
      </div>

      {/* Image Modal */}
      <ImageModal />
    </>
  );
}