"use client";
import { usePathname } from "next/navigation";
import React from "react";
import Link from "next/link";
import Filterfromnavbar from "./filterfromnavbar";
import Searchbar from "./search";
import Rightsection from "./rightsection";

const Navbar = () => {
  const path = usePathname();
  const hideNavbar =
     path === "/signin" || path === "/signup" || path.startsWith("/admin");

  // ⛔ Don't render navbar on these paths
  if (hideNavbar) return null;

  return (
    <div className="h-[58px] sticky top-0 bg-[#0A0A0A] w-full text-white z-50 flex items-center px-4">
      {/* Logo */}
      <div className="flex items-center min-w-[160px]">
        <Link href="/" className="flex items-center">
          <img
            src="/xavique.png"
            alt="Xavique Logo"
            className="w-auto h-[40px] object-contain"
          />
        </Link>
      </div>

      {/* Filter */}
      <div className="ml-4">
        <Filterfromnavbar />
      </div>

      {/* Search */}
      <div className="flex-1 flex justify-center">
        <Searchbar />
      </div>

      {/* Right side */}
      <div className="ml-4 flex">
        <Rightsection />
      </div>
    </div>
  );
};

export default Navbar;
