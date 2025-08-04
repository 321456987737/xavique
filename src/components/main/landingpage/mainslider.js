"use client";
import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import fade from "embla-carousel-fade";
import { ChevronLeft, ChevronRight } from "lucide-react";

const images = [
  "/fourth.jpg",
  "/first.jpeg",
  "/third.jpeg",
  "/second.jpeg",
];

export default function FadeCarousel() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Configure fade plugin with faster duration
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true,
      duration: 0, // Faster base transition
    }, 
    [fade({ duration: 400 })] // Set fade duration to 300ms (default is usually 1000ms)
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on("select", onSelect);
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="relative w-full h-[95vh] overflow-hidden bg-black">
      {/* Embla carousel */}
      <div ref={emblaRef} className="w-full h-full">
        <div className="embla__container relative w-full h-full">
          {images.map((src, index) => (
            <div
              key={index}
              className="embla__slide absolute inset-0 w-full h-full"
              data-embla-fade-slide
            >
              <img
                src={src}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
                loading={index === 0 ? "eager" : "lazy"}
              />
              <div className="absolute inset-0 bg-black/50" />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation buttons */}
      <button
        onClick={scrollPrev}
        className="absolute top-1/2 left-4 cursor-pointer p-3 rounded-full bg-black/80 text-white hover:bg-black/60 transition-all duration-200 transform -translate-y-1/2 z-20"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute top-1/2 right-4 cursor-pointer rounded-full bg-black/80 text-white hover:bg-black/60 transition-all duration-200 transform -translate-y-1/2 z-20 p-3 "
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              selectedIndex === index
                ? "bg-white w-6"
                : "bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}