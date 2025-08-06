"use client";
import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import fade from "embla-carousel-fade";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

const slidesData = [
  {
    image: "/fourth.jpg",
    title: "Luxury Meets Elegance",
    subtitle: "Discover timeless designs crafted for you",
    buttonText: "Explore Collection",
    link: "/collection",
  },
  {
    image: "/first.jpeg",
    title: "Bold & Iconic",
    subtitle: "Unleash your style with standout pieces",
    buttonText: "Explore Collection",
    link: "/collection/",
  },
  {
    image: "/third.jpeg",
    title: "Minimalism Perfected",
    subtitle: "Elevate your essentials with refined aesthetics",
    buttonText: "Explore Collection",
    link: "/collection",
  },
  {
    image: "/second.jpeg",
    title: "Street Luxe",
    subtitle: "A fusion of comfort and class",
    buttonText: "Explore Collection",
    link: "/collection",
  },
];

export default function FadeCarousel() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      duration: 0,
    },
    [fade({ duration: 400 })]
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
      {/* Embla Carousel */}
      <div ref={emblaRef} className="w-full h-full">
        <div className="embla__container relative w-full h-full">
          {slidesData.map((slide, index) => (
            <div
              key={index}
              className="embla__slide absolute inset-0 w-full h-full"
              data-embla-fade-slide
            >
              <img
                src={slide.image}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50" />

              {/* Centered text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
                <h2 className="text-3xl md:text-5xl font-bold mb-4">{slide.title}</h2>
                <p className="text-sm md:text-lg mb-6">{slide.subtitle}</p>
                <Link
                  href={slide.link}
                  className="px-6 py-2 rounded-full border border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all"
                >
                  {slide.buttonText}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={scrollPrev}
        className="absolute top-1/2 left-4 p-3 rounded-full bg-black/80 text-white hover:text-[#D4AF37] hover:bg-black/60 transform -translate-y-1/2 z-20"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute top-1/2 right-4 p-3 rounded-full bg-black/80 text-white hover:text-[#D4AF37] hover:bg-black/60 transform -translate-y-1/2 z-20"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {slidesData.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              selectedIndex === index
                ? "bg-white w-6"
                : "bg-white/50 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// "use client";
// import React, { useCallback, useEffect, useState } from "react";
// import useEmblaCarousel from "embla-carousel-react";
// import fade from "embla-carousel-fade";
// import { ChevronLeft, ChevronRight } from "lucide-react";

// const images = [
//   "/fourth.jpg",
//   "/first.jpeg",
//   "/third.jpeg",
//   "/second.jpeg",
// ];

// export default function FadeCarousel() {
//   const [selectedIndex, setSelectedIndex] = useState(0);

//   // Configure fade plugin with faster duration
//   const [emblaRef, emblaApi] = useEmblaCarousel(
//     { 
//       loop: true,
//       duration: 0, // Faster base transition
//     }, 
//     [fade({ duration: 400 })] // Set fade duration to 300ms (default is usually 1000ms)
//   );

//   const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
//   const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

//   const onSelect = useCallback(() => {
//     if (!emblaApi) return;
//     setSelectedIndex(emblaApi.selectedScrollSnap());
//   }, [emblaApi]);

//   useEffect(() => {
//     if (!emblaApi) return;

//     emblaApi.on("select", onSelect);
//     onSelect();

//     return () => {
//       emblaApi.off("select", onSelect);
//     };
//   }, [emblaApi, onSelect]);

//   return (
//     <div className="relative w-full h-[95vh] overflow-hidden bg-black">
//       {/* Embla carousel */}
//       <div ref={emblaRef} className="w-full h-full">
//         <div className="embla__container relative w-full h-full">
//           {images.map((src, index) => (
//             <div
//               key={index}
//               className="embla__slide absolute inset-0 w-full h-full"
//               data-embla-fade-slide
//             >
//               <img
//                 src={src}
//                 alt={`Slide ${index + 1}`}
//                 className="w-full h-full object-cover"
//                 loading={index === 0 ? "eager" : "lazy"}
//               />
//               <div className="absolute inset-0 bg-black/50" />
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Navigation buttons */}
//       <button
//         onClick={scrollPrev}
//         className="absolute top-1/2 left-4 cursor-pointer p-3 rounded-full bg-black/80 text-white hover:text-[#D4AF37]  hover:bg-black/60 transition-all duration-200 transform -translate-y-1/2 z-20"
//         aria-label="Previous slide"
//       >
//         <ChevronLeft className="w-6 h-6" />
//       </button>
//       <button
//         onClick={scrollNext}
//         className="absolute top-1/2 right-4 cursor-pointer rounded-full bg-black/80 text-white hover:text-[#D4AF37]  hover:bg-black/60 transition-all duration-200 transform -translate-y-1/2 z-20 p-3 "
//         aria-label="Next slide"
//       >
//         <ChevronRight className="w-6 h-6" />
//       </button>

//       {/* Dot indicators */}
//       <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
//         {images.map((_, index) => (
//           <button
//             key={index}
//             onClick={() => emblaApi?.scrollTo(index)}
//             className={`w-3 h-3 rounded-full transition-all duration-200 ${
//               selectedIndex === index
//                 ? "bg-white w-6"
//                 : "bg-white/50 hover:bg-white/70"
//             }`}
//             aria-label={`Go to slide ${index + 1}`}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }