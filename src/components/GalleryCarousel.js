"use client";

import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function GalleryCarousel({ images, title, category, price, originalPrice }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-full bg-[#e8e3d9] flex items-center justify-center">
        <span className="text-[#999] text-sm">NO IMAGE</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full group">
      <div className="overflow-hidden w-full h-full" ref={emblaRef}>
        <div className="flex w-full h-full">
          {images.map((img, idx) => (
            <div className="flex-[0_0_100%] min-w-0" key={idx}>
              <img
                src={`${img.url}?tr=h-600,w-600,c-fill,f-auto,q-auto`}
                alt={`${title} ${idx + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Left & Right Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              emblaApi && emblaApi.scrollPrev();
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
          >
            <ChevronLeft className="w-5 h-5 md:w-7 md:h-7" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              emblaApi && emblaApi.scrollNext();
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
          >
            <ChevronRight className="w-5 h-5 md:w-7 md:h-7" />
          </button>
        </>
      )}

      {/* Product Info Overlay */}
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent px-4 py-3 text-white flex items-end justify-between">
        <div>
          <h2 className="text-lg font-bold leading-tight">{title}</h2>
          <p className="text-[10px] uppercase tracking-widest opacity-80">{category}</p>
        </div>

        <div className="text-right">
          <p className="text-sm font-medium">${price}</p>
          {originalPrice && <p className="text-[10px] line-through opacity-70">${originalPrice}</p>}
        </div>
      </div>
    </div>
  );
}
