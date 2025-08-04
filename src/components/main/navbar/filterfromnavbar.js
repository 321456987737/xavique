"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function Filterfromnavbar() {
  const router = useRouter();

  // Categories array
  const categories = [
    { label: "Shop", value: "all" },
    { label: "New Arrivals", value: "new" },
    { label: "Men", value: "men" },
    { label: "Women", value: "women" },
    { label: "Accessories", value: "accessories" },
    { label: "Sale", value: "sale" },
  ];

const handleClick = (value) => {
    if (value === "all") {
      router.push("/collection");
    } else {
      router.push(`/collection/${value}`);
    }
  };
  return (
    <div>
      <div className="flex items-center justify-between h-[58px] gap-4">
        {categories.map((cat) => (
          <div
            key={cat.value}
            className="hover:text-[#D4AF37] font-semibold transition-all duration-300 ease-in-out cursor-pointer"
            onClick={() => handleClick(cat.value)}
          >
            {cat.label}
          </div>
        ))}
      </div>
    </div>
  );
}
