"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { 
  Star, Heart, ShoppingCart, Share2, ChevronLeft, ChevronRight, Plus,Minus,
  Truck, RefreshCw, Check, Package, Ruler, CreditCard, Shield,
  X, ZoomIn, Award, Clock, Users, MessageCircle, ArrowRight
} from "lucide-react";

export default function SingleProductPage() {
  const router = useRouter();
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    if (!slug) return;

    async function fetchProduct() {
      try {
        setIsLoading(true);
        const res = await axios.get(`/api/getsingalproducts/${slug}`);
        if (!res.data.success) throw new Error("Failed to fetch product");
        const data = res.data.product;
        setProduct(data);
        if (data.images && data.images.length > 0) {
          setMainImage(data.images[0].url);
        }
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setIsLoading(false);
      }
    }

    fetchProduct();
  }, [slug]);

  const handleImageClick = (index) => {
    setModalImageIndex(index);
    setShowImageModal(true);
  };

  const nextImage = () => {
    if (product.images.length > 0) {
      const nextIndex = (currentImageIndex + 1) % product.images.length;
      setMainImage(product.images[nextIndex].url);
      setCurrentImageIndex(nextIndex);
    }
  };

  const prevImage = () => {
    if (product.images.length > 0) {
      const prevIndex = (currentImageIndex - 1 + product.images.length) % product.images.length;
      setMainImage(product.images[prevIndex].url);
      setCurrentImageIndex(prevIndex);
    }
  };

  const nextModalImage = () => {
    setModalImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevModalImage = () => {
    setModalImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const incrementQuantity = () => {
    setQuantity(prev => Math.min(prev + 1, product.stockQuantity));
  };

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(prev - 1, 1));
  };

  if (isLoading) {
    return (
     <div className="min-h-screen bg-[#0A0A0A] p-4 flex items-center justify-center">
  <div className="container mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      
      {/* Image Skeleton */}
      <div className="flex justify-center">
        <div className="w-full max-w-md aspect-square bg-slate-200 animate-pulse rounded-lg"></div>
      </div>

      {/* Details Skeleton */}
      <div className="space-y-4">
        {/* Title */}
        <div className="h-8 bg-slate-200 animate-pulse rounded w-3/4"></div>

        {/* Price */}
        <div className="h-6 bg-slate-200 animate-pulse rounded w-1/3"></div>

        {/* Description */}
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 animate-pulse rounded w-full"></div>
          <div className="h-4 bg-slate-200 animate-pulse rounded w-5/6"></div>
          <div className="h-4 bg-slate-200 animate-pulse rounded w-2/3"></div>
        </div>

        {/* Button */}
        <div className="h-12 bg-slate-300 animate-pulse rounded-md w-40 mt-4"></div>
      </div>

    </div>
  </div>
</div>

    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">Product Not Found</h2>
          <p className="text-slate-600">The requested product could not be found.</p>
        </div>
      </div>
    );
  }

  // Image Modal Component
  const ImageModal = () => (
    <div className={`fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm ${showImageModal ? 'block' : 'hidden'}`}>
      <button 
        onClick={() => setShowImageModal(false)}
        className="absolute top-6 right-6 text-white/70 hover:text-[#D4AF37] z-50 transition-colors p-2 hover:bg-[#D4AF37]/10 rounded-full"
      >
        <X size={28} />
      </button>
      
      <div className="relative max-w-5xl max-h-full w-full bg-[#0A0A0A]">
        <div className="relative bg-[#0A0A0A] rounded-lg overflow-hidden shadow-2xl">
          <img 
            src={product.images[modalImageIndex]?.url} 
            alt={`${product.title} ${modalImageIndex + 1}`}
            className="w-full h-auto max-h-[80vh] object-contain"
          />
          
          {product.images.length > 1 && (
            <>
              <button 
                onClick={prevModalImage}
                className="absolute left-4 top-1/2 text-white transform -translate-y-1/2 bg-[#D4AF37]/20 hover:bg-[#D4AF37]/80  rounded-full p-3 shadow-lg transition-all hover:scale-105"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={nextModalImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-[#D4AF37]/20 hover:bg-[#D4AF37]/80 text-white rounded-full p-3 shadow-lg transition-all hover:scale-105"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}
          
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
            {product.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setModalImageIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  modalImageIndex === index ? 'bg-white scale-125' : 'bg-white/60 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="min-h-screen bg-[#0A0A0A] text-white  transition-all">
        {/* Desktop Layout */}
        <div className=" flex pt-32 justify-center gap-32 lg:flex">
          {/* Left Side - Full Height Images */}
          <div className=" max-w-[35%] gap-6 h-full  flex flex-col">
            {product.images.map((img, index) => (
              <div 
                key={index}
                className="h-[80vh] border border-[#D4AF37]  relative rounded-md cursor-pointer group overflow-hidden bg-[#0A0A0A] text-white hover:text-[#D4AF37] transition-all"
                onClick={() => handleImageClick(index)}
              >
                <img 
                  src={img.url} 
                  alt={`${product.title} ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
                />
                
                {/* Premium overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-[#0A0A0A]/95 text-white hover:text-[#D4AF37] backdrop-blur-sm rounded-full p-4 transform scale-90 group-hover:scale-100 transition-transform duration-300 shadow-xl">
                      <ZoomIn size={28} className="border-slate-200 hover:border-slate-300 bg-[#0A0A0A] " />
                    </div>
                  </div>
                </div>
                
                {/* Premium badges on first image */}
                {index === 0 && (
                  <div className="absolute top-8 left-8 flex flex-col gap-3">
                    {product.isFeatured && (
                      <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-2 rounded-full flex items-center shadow-lg backdrop-blur-sm">
                        <Award size={16} className="mr-2" />
                        <span className="font-semibold text-sm tracking-wide">FEATURED</span>
                      </div>
                    )}
                    {product.discountPrice && (
                      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full shadow-lg backdrop-blur-sm">
                        <span className="font-bold text-sm tracking-wide">
                          {Math.round(100 - (product.discountPrice / product.price * 100))}% OFF
                        </span>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Image counter with premium styling */}
                {/* <div className="absolute bottom-8 right-8 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                  {index + 1} / {product.images.length}
                </div> */}
              </div>
            ))}
          </div>
            {/* <div className="w-[2px] h-[100vh] bg-[#D4AF37] border border-[#D4AF37]"/> */}
          {/* Right Side - Product Details (Sticky) */}
          <div className="sticky top-0 h-full bg-[#0A0A0A] text-white hover:text-[#D4AF37] transition-all">
  <div className="p-8 xl:p-12">
    {/* Breadcrumbs */}
    <nav className="text-xs text-slate-500 mb-6 flex items-center">
      <span className=" text-white hover:text-[#D4AF37] transition-all cursor-pointer ">Home</span>
      <ChevronRight size={12} className="mx-2  text-white hover:text-[#D4AF37] transition-all" />
      <span className=" text-white hover:text-[#D4AF37] transition-all cursor-pointer ">{product.category}</span>
      <ChevronRight size={12} className="mx-2 text-white hover:text-[#D4AF37] transition-all" />
      <span className=" text-white hover:text-[#D4AF37] transition-all cursor-pointer ">{product.subcategory}</span>
      <ChevronRight size={12} className="mx-2  text-white hover:text-[#D4AF37] transition-all" />
      <span className="font-medium  text-white hover:text-[#D4AF37] transition-all truncate">{product.title}</span>
    </nav>

    {/* Title + Rating */}
    <div className="mb-6">
      <h1 className="text-2xl xl:text-3xl font-bold  text-white hover:text-[#D4AF37] transition-all mb-3 leading-snug">{product.title}</h1>
      <div className="flex items-center gap-3">
        <div className="flex items-center">
          <div className="flex text-white hover:text-[#D4AF37] transition-all">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} fill="currentColor" className={i < 4 ? 'text-amber-400' : 'text-slate-300'} />
            ))}
          </div>
          <span className="ml-2 text-slate-600 font-medium text-sm">4.8</span>
        </div>
        <div className="h-3 w-px bg-slate-300"></div>
        <button className="b text-white hover:text-[#D4AF37] transition-all  flex items-center gap-1 text-sm">
          <MessageCircle size={14} />
          <span className="font-medium">128 Reviews</span>
        </button>
      </div>
    </div>

    {/* Price */}
    <div className="mb-6 p-4  text-white hover:text-[#D4AF37] transition-all rounded-xl border border-[#ffc813]">
      <div className="flex items-baseline gap-3 mb-2">
        {product.discountPrice ? (
          <>
            <span className="text-2xl font-bold text-white hover:text-[#D4AF37] transition-all">${product.discountPrice.toFixed(2)}</span>
            <span className="text-lg text-red-600 hover:text-red-500 transition-all line-through">${product.price.toFixed(2)}</span>
            <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-semibold">
              Save ${(product.price - product.discountPrice).toFixed(2)}
            </span>
          </>
        ) : (
          <span className="text-2xl font-bold text-slate-900">${product.price.toFixed(2)}</span>
        )}
      </div>
      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center text-green-700">
          <Check size={14} className="mr-1 " /> In Stock
        </div>
        <div className="flex items-center text-slate-600 text-white hover:text-[#D4AF37] transition-all">
          <Package size={14} className="mr-1" /> {product.stockQuantity} Available
        </div>
        <div className="flex items-center text-slate-600 text-white hover:text-[#D4AF37] transition-all">
          <Clock size={14} className="mr-1 " /> Ships Today
        </div>
      </div>
    </div>

    {/* Description */}
    <p className="text-white hover:text-[#D4AF37] transition-all text-sm leading-relaxed mb-6">
      {product.description || "Expertly crafted with premium materials for the perfect balance of style and functionality."}
    </p>

    {/* Colors */}
    {product.colors?.length > 0 && (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-md font-semibold text-white hover:text-[#D4AF37] transition-all">Color</h3>
          {selectedColor && <span className="text-xs text-white hover:text-[#D4AF37] transition-all capitalize">{selectedColor}</span>}
        </div>
        <div className="flex flex-wrap gap-2">
          {product.colors.map((color, index) => (
            <button
              key={index}
              onClick={() => setSelectedColor(color)}
              className={`w-9 h-9 rounded-full text-white hover:text-[#D4AF37] transition-all border-2  relative ${
                selectedColor === color ? 'border-[#D4AF37] scale-105 shadow-md' : 'border-white hover:border-[#D4AF37]'
              }`}
              style={{ backgroundColor: color.toLowerCase() }}
              title={color}
            >
              {selectedColor === color && (
                <div className="absolute inset-0 rounded-full flex items-center justify-center">
                  <Check size={14} className="text-white drop-shadow-sm" />
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
          <h3 className="text-sm font-semibold text-white hover:text-[#D4AF37] transition-all">Size</h3>
          <button className="text-xs text-white hover:text-[#D4AF37] transition-all font-medium flex items-center">
            <Ruler size={14} className="mr-1" /> Size Guide
          </button>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {product.sizes.map((size, index) => (
            <button
              key={index}
              onClick={() => setSelectedSize(size)}
              className={`py-2 px-2 rounded-lg border text-xs font-semibold transition-all ${
                selectedSize === size
                  ? 'border-[#D4AF37] bg-[#cfb971]/50 text-white shadow'
                  : 'border-slate-200 hover:border-slate-300 bg-[#0A0A0A] hover:bg-[#cfb971]/50'
              }`}
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
        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
          <button
            onClick={decrementQuantity}
            className="px-3 py-2 border-r border-slate-200 hover:border-slate-300 bg-[#0A0A0A] hover:bg-[#cfb971]/50"
            disabled={quantity <= 1}
          >
            <Minus size={16} className={quantity <= 1 ? 'text-slate-300' : 'text-[#D4AF37]'} />
          </button>
          <span className="px-4 py-2 font-semibold text-sm">{quantity}</span>
          <button
            onClick={incrementQuantity}
            className="px-3 py-2 border-slate-200 hover:border-slate-300 bg-[#0A0A0A] hover:bg-[#cfb971]/50 border-l"
            disabled={quantity >= product.stockQuantity}
          >
            <Plus size={16} className={quantity >= product.stockQuantity ? 'text-slate-300' : 'text-[#D4AF37]'} />
          </button>
        </div>

       <button
  className="flex-1 bg-gradient-to-r from-[#D4AF37] to-[#D4AF37]/20 border border-[#D4AF37] text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center transition-all duration-500 shadow hover:-translate-y-0.5 cursor-pointer text-sm hover:from-[#D4AF37]/20 hover:to-[#D4AF37]"
>
  <ShoppingCart size={18} className="mr-2" /> Add to Cart
</button>


      </div>
    </div>
  </div>
</div>

        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden">
          {/* Mobile Carousel */}
          <div className="relative">
            <div className="aspect-square w-full relative overflow-hidden bg-slate-50">
              <img 
                src={product.images[currentImageIndex]?.url} 
                alt={`${product.title} ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
                onClick={() => handleImageClick(currentImageIndex)}
              />
              
              {product.images.length > 1 && (
                <>
                  <button 
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-slate-800 rounded-full p-3 shadow-lg transition-all"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button 
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-slate-800 rounded-full p-3 shadow-lg transition-all"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
              
              {/* Premium badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isFeatured && (
                  <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-3 py-1.5 rounded-full flex items-center text-xs font-semibold">
                    <Award size={12} className="mr-1" />
                    FEATURED
                  </div>
                )}
                {product.discountPrice && (
                  <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1.5 rounded-full text-xs font-bold">
                    {Math.round(100 - (product.discountPrice / product.price * 100))}% OFF
                  </div>
                )}
              </div>
              
              {/* Image counter */}
              <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium">
                {currentImageIndex + 1} / {product.images.length}
              </div>
            </div>
            
            {/* Dots indicator */}
            {product.images.length > 1 && (
              <div className="flex justify-center mt-4 gap-2">
                {product.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentImageIndex(index);
                      setMainImage(product.images[index].url);
                    }}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      currentImageIndex === index ? 'bg-slate-900 scale-125' : 'bg-slate-300'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
          
          {/* Mobile Product Details */}
          <div className="p-6">
            {/* Breadcrumbs */}
            <nav className="text-sm text-slate-500 mb-4 flex items-center overflow-x-auto">
              <span className="hover:text-slate-700 cursor-pointer whitespace-nowrap">Home</span>
              <ChevronRight size={12} className="mx-2 text-slate-400 flex-shrink-0" />
              <span className="hover:text-slate-700 cursor-pointer whitespace-nowrap">{product.category}</span>
              <ChevronRight size={12} className="mx-2 text-slate-400 flex-shrink-0" />
              <span className="font-medium text-slate-700 truncate">{product.title}</span>
            </nav>
            
            {/* Title and Rating */}
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">{product.title}</h1>
              <div className="flex items-center gap-3">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" className={i < 4 ? 'text-amber-400' : 'text-slate-300'} />
                  ))}
                </div>
                <span className="text-slate-600 text-sm">4.8 (128 reviews)</span>
              </div>
            </div>
            
            {/* Pricing */}
            <div className="mb-6 p-4 bg-slate-50 rounded-xl">
              <div className="flex items-baseline gap-3 mb-2">
                {product.discountPrice ? (
                  <>
                    <span className="text-3xl font-bold text-slate-900">${product.discountPrice.toFixed(2)}</span>
                    <span className="text-xl text-slate-500 line-through">${product.price.toFixed(2)}</span>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-slate-900">${product.price.toFixed(2)}</span>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center text-green-700">
                  <Check size={14} className="mr-1" /> 
                  <span className="font-medium">In Stock</span>
                </div>
                <div className="text-slate-600">{product.stockQuantity} Available</div>
              </div>
            </div>
            
            {/* Description */}
            <div className="mb-6">
              <p className="text-slate-700 leading-relaxed">
                {product.description || "Premium quality product with excellent craftsmanship."}
              </p>
            </div>
            
            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-slate-900">Color</h3>
                  {selectedColor && (
                    <span className="text-sm text-slate-600 capitalize">{selectedColor}</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full border-2 transition-all duration-200 relative ${
                        selectedColor === color 
                          ? 'border-slate-900 scale-110 shadow-md' 
                          : 'border-slate-300 hover:border-slate-400'
                      }`}
                      style={{ backgroundColor: color.toLowerCase() }}
                      title={color}
                    >
                      {selectedColor === color && (
                        <div className="absolute inset-0 rounded-full flex items-center justify-center">
                          <Check size={14} className="text-white" style={{
                            filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.5))'
                          }} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-slate-900">Size</h3>
                  <button className="text-slate-600 hover:text-slate-900 text-sm font-medium flex items-center transition-colors">
                    <Ruler size={14} className="mr-1" /> Size Guide
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {product.sizes.map((size, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 px-2 rounded-lg border-2 transition-all text-sm font-semibold ${
                        selectedSize === size 
                          ? 'border-slate-900 bg-slate-900 text-white' 
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Quantity and Add to Cart */}
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center border-2 border-slate-200 rounded-lg overflow-hidden bg-white">
                  <button 
                    onClick={decrementQuantity}
                    className="px-3 py-2.5 hover:bg-slate-50 transition-colors"
                    disabled={quantity <= 1}
                  >
                    <ChevronLeft size={16} className={quantity <= 1 ? 'text-slate-300' : 'text-slate-600'} />
                  </button>
                  <span className="px-4 py-2.5 font-semibold min-w-[50px] text-center">{quantity}</span>
                  <button 
                    onClick={incrementQuantity}
                    className="px-3 py-2.5 hover:bg-slate-50 transition-colors"
                    disabled={quantity >= product.stockQuantity}
                  >
                    <ChevronRight size={16} className={quantity >= product.stockQuantity ? 'text-slate-300' : 'text-slate-600'} />
                  </button>
                </div>
                
                <button className="flex-1 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center transition-all shadow-lg">
                  <ShoppingCart size={18} className="mr-2" />
                  Add to Cart
                </button>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
              <button className="flex items-center justify-center gap-2 border-2 border-slate-200 hover:border-slate-300 rounded-lg py-3 px-4 flex-1 text-slate-700 hover:bg-slate-50 transition-all">
                <Heart size={18} className="text-red-500" />
                <span className="font-medium">Save</span>
              </button>
              <button className="flex items-center justify-center gap-2 border-2 border-slate-200 hover:border-slate-300 rounded-lg py-3 px-4 flex-1 text-slate-700 hover:bg-slate-50 transition-all">
                <Share2 size={18} className="text-slate-600" />
                <span className="font-medium">Share</span>
              </button>
            </div>
            
            {/* Mobile Tabs */}
            <div className="border-t border-slate-200 pt-6">
              <div className="flex gap-6 border-b border-slate-200 mb-4 overflow-x-auto">
                {['details', 'shipping', 'returns'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 font-medium capitalize transition-colors whitespace-nowrap relative ${
                      activeTab === tab 
                        ? 'text-slate-900 border-b-2 border-slate-900' 
                        : 'text-slate-600'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              
              {activeTab === 'details' && (
                <div className="space-y-3">
                  {[
                    { label: 'Category', value: product.category, icon: Package },
                    { label: 'Subcategory', value: product.subcategory, icon: Package },
                    { label: 'Material', value: 'Premium Cotton Blend', icon: Shield },
                    { label: 'Care', value: 'Machine Wash Cold', icon: RefreshCw }
                  ].map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-slate-100">
                      <span className="text-slate-600 text-sm flex items-center">
                        <item.icon size={16} className="mr-2 text-slate-400" />
                        {item.label}
                      </span>
                      <span className="font-medium text-slate-900 text-sm">{item.value}</span>
                    </div>
                  ))}
                </div>
              )}
              
              {activeTab === 'shipping' && (
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 p-2.5 rounded-lg mt-0.5">
                      <Truck size={18} className="text-green-700" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">Free Standard Shipping</h4>
                      <p className="text-slate-600 text-sm">Orders over $50. Delivered in 3-5 business days.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2.5 rounded-lg mt-0.5">
                      <Clock size={18} className="text-blue-700" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">Express Shipping</h4>
                      <p className="text-slate-600 text-sm">Next-day delivery for $15. Order by 2 PM.</p>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'returns' && (
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-amber-100 p-2.5 rounded-lg mt-0.5">
                      <RefreshCw size={18} className="text-amber-700" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">30-Day Returns</h4>
                      <p className="text-slate-600 text-sm">Easy returns within 30 days. Original condition required.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-purple-100 p-2.5 rounded-lg mt-0.5">
                      <CreditCard size={18} className="text-purple-700" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">Secure Payments</h4>
                      <p className="text-slate-600 text-sm">Encrypted transactions. All major cards accepted.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <ImageModal />
    </>
  );
}