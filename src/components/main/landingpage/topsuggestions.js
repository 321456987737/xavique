"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const Topsuggestions = () => {
  const cards = [
    {
      BgColor: "bg-green-400",
      category: "men",
      subcategory: "jewelery",
      image: "/a_men_jewelry_with_dark_theme_bg.jpeg",
    },
    {
      BgColor: "bg-cyan-400",
      category: "men",
      subcategory: "shoes",
      image: "/a_men_shoe_like_clark_shoe_boats.jpeg",
    },
    {
      BgColor: "bg-red-400",
      category: "men",
      subcategory: "perfumes",
      image: "/create_an_image_of_men_perfume_that.jpeg",
    },
    {
      BgColor: "bg-pink-400",
      category: "women",
      subcategory: "begs",
      image: "/create_an_image_of_women_jewelery_that.jpeg",
    },
    {
      BgColor: "bg-yellow-400",
      category: "women",
      subcategory: "hign heels",
      image: "/create_an_image_of_women_high_heels.jpeg",
    },
    {
      BgColor: "bg-orange-400",
      category: "women",
      subcategory: "dress",
      image: "/design_a_high_fashion_luxury_women_s_dress_inspired.jpeg",
    },
    {
      BgColor: "bg-gray-400",
      category: "women",
      subcategory: "bags",
      image: "/create_an_image_of_women_hand_bag.jpeg",
    },
    {
      BgColor: "bg-slate-400",
      category: "men",
      subcategory: "caps",
      image: "/design_a_large_elegant_women_s_fashion_cap.jpeg",
    },
  ];

  return (
    <section className="w-full px-4 py-10 bg-[#0A0A0A] text-white">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-2xl md:text-4xl font-bold tracking-wider mb-8 text-center text-[#D4AF37]"
        >
          Top Suggestions
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <Link
                href={`/${card.category}/${card.subcategory}`}
                className="relative group rounded-xl overflow-hidden shadow-lg border border-[#D4AF37]/10 hover:scale-[1.03] transition-transform duration-300"
              >
                <div className="w-full h-[280px] relative">
                  <Image
                    src={card.image}
                    alt={`${card.category} - ${card.subcategory}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-all duration-300 flex items-end">
                    <div className="p-4">
                      <p className="text-sm uppercase tracking-widest text-[#D4AF37]">
                        {card.category}
                      </p>
                      <p className="text-lg font-semibold capitalize">
                        {card.subcategory}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Topsuggestions;

// import React from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import motion from "framer-motion";
// const Topsuggestions = () => {
//   const cards = [
//     {
//       BgColor: "bg-green-400",
//       category: "men",
//       subcategory: "jewelery",
//       image: "/a_men_jewelry_with_dark_theme_bg.jpeg",
//     },
//     {
//       BgColor: "bg-cyan-400",
//       category: "men",
//       subcategory: "shoes",
//       image: "/a_men_shoe_like_clark_shoe_boats.jpeg",
//     },
//     {
//       BgColor: "bg-red-400",
//       category: "men",
//       subcategory: "perfumes",
//       image: "/create_an_image_of_men_perfume_that.jpeg",
//     },
//     {
//       BgColor: "bg-pink-400",
//       category: "women",
//       subcategory: "begs",
//       image: "/create_an_image_of_women_jewelery_that.jpeg",
//     },
//     {
//       BgColor: "bg-yellow-400",
//       category: "women",
//       subcategory: "hign heels",
//       image: "/create_an_image_of_women_high_heels.jpeg",
//     },
//     {
//       BgColor: "bg-orange-400",
//       category: "women",
//       subcategory: "dress",
//       image: "/design_a_high_fashion_luxury_women_s_dress_inspired.jpeg",
//     },
//     {
//       BgColor: "bg-gray-400",
//       category: "women",
//       subcategory: "bags",
//       image: "/create_an_image_of_women_hand_bag.jpeg",
//     },
//     {
//       BgColor: "bg-slate-400",
//       category: "men",
//       subcategory: "caps",
//       image: "/design_a_large_elegant_women_s_fashion_cap.jpeg",
//     },
//   ];

//   return (
//     <section className="w-full px-4 py-10 bg-[#0A0A0A] text-white">
//       <div className="max-w-6xl mx-auto">
//         <h2 className="text-2xl md:text-4xl font-bold tracking-wider mb-8 text-center text-[#D4AF37]">
//           Top Suggestions
//         </h2>

//         <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//           {cards.map((card, index) => (
//             <Link
//               key={index}
//               href={`/${card.category}/${card.subcategory}`}
//               className="relative group rounded-xl overflow-hidden shadow-lg border border-[#D4AF37]/10 hover:scale-[1.03] transition-transform duration-300"
//             >
//               <div className="w-full h-[280px] relative">
//                 <Image
//                   src={card.image}
//                   alt={`${card.category} - ${card.subcategory}`}
//                   fill
//                   className="object-cover group-hover:scale-105 transition-transform duration-500"
//                 />
//                 <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-all duration-300 flex items-end">
//                   <div className="p-4">
//                     <p className="text-sm uppercase tracking-widest text-[#D4AF37]">
//                       {card.category}
//                     </p>
//                     <p className="text-lg font-semibold capitalize">
//                       {card.subcategory}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </Link>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Topsuggestions;
