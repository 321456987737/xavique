"use client";
import React from "react";
import Link from "next/link";
import { User, Heart, ShoppingBag } from "lucide-react";
import { useSession } from "next-auth/react";
export default function Rightsection() {
  const{data:session} = useSession();
  return (
    
    <div className="flex items-center justify-center h-[58px] gap-4">
      <div>
        <Link href={session ? "/collection" : "/signin"}>
          <User
            strokeWidth={1.5}
            className="hover:text-[#D4AF37] text-white transition-all duration-300 ease-in-out"
          />
        </Link>
      </div>
      <div>
        <Link href={"/wishlist"}>
          <Heart
            strokeWidth={1.5}
            className="hover:text-[#D4AF37] text-white transition-all duration-300 ease-in-out"
          />
        </Link>
      </div>
      <div>
        <Link href={"/cart"}>
          <ShoppingBag
            strokeWidth={1.5}
            className="hover:text-[#D4AF37] text-white transition-all duration-300 ease-in-out"
          />
        </Link>
      </div>
    </div>
  );
}
