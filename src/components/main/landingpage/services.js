"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";

const servicesData = [
  {
    title: "Client Advisor Services",
    description: "Contact Us",
    link: "/contact",
    image: "/LV_ContactUs_WW_HP_Services_Push_20240425_DII.webp",
  },
  {
    title: "Art of Gifting",
    description: "Gifts for Women  |  Gifts for Men",
    link: "/gifts",
    image: "/LV_ContactUs_WW_HP_Services_Push_20240425_DII.webp",
  },
  {
    title: "Personalization",
    description: "Explore",
    link: "/personalization",
    image: "/LV_Personalization_WW_HP_Services_Push_1104_DII.webp",
  },
];

const Services = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  return (
    <motion.section
      className="bg-[#0A0A0A] py-20 px-4 md:px-10"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Xavique Services
        </h2>
        <p className="text-white mb-12 max-w-2xl mx-auto">
          Xavique offers an array of tailored services – including Client Advisor
          support, signature gift wrapping, and exclusive personalization options.
        </p>

        {/* Mobile Carousel */}
        <div className="block md:hidden">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {servicesData.map((service, index) => (
                <div
                  key={index}
                  className="flex-[0_0_100%] px-4 flex flex-col items-center"
                >
                  <div className="relative w-full aspect-square overflow-hidden rounded-xl shadow-md">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="mt-6 text-lg font-semibold text-white">
                    {service.title}
                  </h3>
                  <Link
                    href={service.link}
                    className="mt-2 text-sm text-[#D4AF37] underline hover:text-[#5A1A17] transition"
                  >
                    {service.description}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Dots */}
          <div className="mt-6 flex justify-center gap-2">
            {servicesData.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  selectedIndex === index
                    ? "bg-[#D4AF37] scale-110"
                    : "bg-white/30"
                }`}
                onClick={() => emblaApi?.scrollTo(index)}
              ></button>
            ))}
          </div>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-8">
          {servicesData.map((service, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="relative w-full aspect-square overflow-hidden rounded-xl shadow-md">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="mt-6 text-lg font-semibold text-white">
                {service.title}
              </h3>
              <Link href={service.link} className="group inline-block">
  <button className="flex items-center justify-center gap-2 px-5 py-2 my-8 rounded border border-white bg-[#0A0A0A] text-white hover:bg-[#D4AF37]/10 hover:border-[#D4AF37] transition-all duration-300">
    <span className="text-sm font-medium group-hover:text-[#D4AF37] transition-colors">
      {service.description}
    </span>
  </button>
</Link>

            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default Services;
