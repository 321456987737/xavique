"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const products = [
  {
    id: 1,
    title: "Elegant Leather Bag",
    price: "$249",
    bg: "bg-pink-200",
    img: "/design_a_bold_high_fashion_statement_bag_for (1).jpeg",
  },
  {
    id: 2,
    title: "Vintage Tote",
    price: "$179",
    bg: "bg-red-200",
    img: "/Pokecut_1754397204814.jpg",
  },
  {
    id: 3,
    title: "Luxury Handbag",
    price: "$299",
    bg: "bg-yellow-200",
    img: "/design_a_bold_high_fashion_statement_bag_for2.jpg",
  },
  {
    id: 4,
    title: "Elegant Leather Bag",
    price: "$249",
    bg: "bg-pink-200",
    img: "/design_a_bold_high_fashion_statement_bag_for (1).jpeg",
  },
  {
    id: 5,
    title: "Vintage Tote",
    price: "$179",
    bg: "bg-red-200",
    img: "/Pokecut_1754397204814.jpg",
  },
  {
    id: 6,
    title: "Luxury Handbag",
    price: "$299",
    bg: "bg-yellow-200",
    img: "/design_a_bold_high_fashion_statement_bag_for2.jpg",
  },
  {
    id: 7,
    title: "Elegant Leather Bag",
    price: "$249",
    bg: "bg-pink-200",
    img: "/design_a_bold_high_fashion_statement_bag_for (1).jpeg",
  },
  {
    id: 8,
    title: "Vintage Tote",
    price: "$179",
    bg: "bg-red-200",
    img: "/Pokecut_1754397204814.jpg",
  },
];

const sections = [
  { image: "/landingpagemodel1.jpeg" },
  { image: "/landingpagemodel2.jpeg" },
];

const Thirdsection = () => {
  const router = useRouter();

  return (
    <div className="w-full">
      {sections.map((section, index) => {
        const sectionProducts = products.slice(index * 4, index * 4 + 4);

        return (
          <div key={index} className="w-full">
            {/* Mobile View */}
            <div className="md:hidden relative">
              <div className="sticky top-0 h-screen w-full z-0">
                <Image
                  src={section.image}
                  alt={`Hero ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />
              </div>

              <div className="relative z-10 pt-12 pb-16 bg-[#0A0A0A]">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="text-3xl font-bold mb-8 text-center text-[#D4AF37]"
                >
                  Featured Bags
                </motion.h2>

                <div className="grid grid-cols-2 gap-4 px-4">
                  {sectionProducts.map((product, i) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      viewport={{ once: true }}
                      className={`group rounded-xl overflow-hidden shadow-lg`}
                    >
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.4 }}
                        viewport={{ once: true }}
                        className="relative w-full aspect-[3/4]"
                      >
                        <Image
                          src={product.img}
                          alt={product.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex flex-col justify-end p-4">
                          <div className="flex justify-between items-end">
                            <div>
                              <h3 className="text-sm text-white font-semibold group-hover:text-[#D4AF37] transition-colors duration-200">
                                {product.title}
                              </h3>
                              <p className="text-xs text-white/80 group-hover:text-[#D4AF37] transition-colors duration-200">
                                {product.price}
                              </p>
                            </div>
                            <button className="text-xs px-3 py-1.5 rounded-full border border-white/20 text-white bg-white/10 hover:text-[#D4AF37] hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all">
                              View
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  ))}
                </div>

                {/* Discover Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="mt-24 mb-12 flex justify-center"
                >
                  <button
                    onClick={() => router.push(`/section/${index}`)}
                    className="px-6 py-2 text-sm font-medium rounded-full border border-white/20 text-white bg-white/10 hover:text-[#D4AF37] hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all"
                  >
                    Discover This Section
                  </button>
                </motion.div>
              </div>
            </div>

            {/* Desktop View */}
            <div className="hidden md:block w-full">
              <div className="relative w-full h-[100vh]">
                <Image
                  src={section.image}
                  alt={`Hero ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />
              </div>

              <section className="w-full px-8 py-16 bg-[#0A0A0A] text-white">
                <div className="max-w-7xl mx-auto">
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-4xl font-bold mb-12 text-center text-[#D4AF37]"
                  >
                    Featured Bags
                  </motion.h2>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {sectionProducts.map((product, i) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1, duration: 0.5 }}
                        viewport={{ once: true }}
                        className={`group rounded-xl overflow-hidden shadow-xl hover:scale-[1.02] transition-transform duration-300 ease-out`}
                      >
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3, duration: 0.4 }}
                          viewport={{ once: true }}
                          className="relative w-full aspect-[3/4]"
                        >
                          <Image
                            src={product.img}
                            alt={product.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex flex-col justify-end p-5">
                            <div className="flex justify-between items-end">
                              <div>
                                <h3 className="text-base font-semibold text-white group-hover:text-[#D4AF37] transition-colors duration-200">
                                  {product.title}
                                </h3>
                                <p className="text-sm font-light text-white/90 group-hover:text-[#D4AF37] transition-colors duration-200">
                                  {product.price}
                                </p>
                              </div>
                              <button className="text-xs px-4 py-2 rounded-full border border-white/20 text-white bg-white/10 hover:text-[#D4AF37] hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all">
                                View
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Discover Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="mt-24 mb-12 flex justify-center"
                  >
                    <button
                      onClick={() => router.push(`/section/${index}`)}
                      className="px-6 py-2 text-sm font-medium rounded-full border border-white/20 text-white bg-white/10 hover:text-[#D4AF37] hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all"
                    >
                      Discover This Section
                    </button>
                  </motion.div>
                </div>
              </section>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Thirdsection;
