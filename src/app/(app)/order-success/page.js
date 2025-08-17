"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCartStore } from "@/store/cartStore";

export default function OrderSuccessPage() {
  const { clearCart } = useCartStore();
  
  useEffect(() => {
    clearCart();
    
    // Retrieve session ID from URL
    const query = new URLSearchParams(window.location.search);
    const sessionId = query.get('session_id');
    
    if (sessionId) {
      console.log("Stripe payment successful. Session ID:", sessionId);
      // Here you would typically send the session ID to your backend
      // to verify the payment and create an order record
    }
  }, [clearCart]);

  return (
    <div className="min-h-screen pt-[120px] bg-[#0A0A0A] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <div className="flex justify-center mb-8">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-[#D4AF37] to-[#F5E8B5] w-10 h-10 rounded-full flex items-center justify-center mr-3">
              <span className="text-[#0A0A0A] font-bold text-xl">L</span>
            </div>
            <h1 className="text-2xl font-bold text-white">LUXE GADGETS</h1>
          </div>
        </div>

        <div className="bg-[#1A1A1A] rounded-xl shadow-xl overflow-hidden border border-gray-800 p-8">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-12 h-12 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-4">
            Order Confirmed!
          </h1>
          
          <p className="text-gray-300 mb-8 max-w-md mx-auto">
            Thank you for your purchase. Your order has been confirmed and will be processed shortly. 
            A confirmation email has been sent to your email address.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/"
              className="px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#F5E8B5] text-[#0A0A0A] font-bold rounded-lg hover:opacity-90 transition-opacity"
            >
              Continue Shopping
            </Link>
            
            <Link
              href="/orders"
              className="px-6 py-3 bg-transparent border border-[#D4AF37] text-[#D4AF37] font-bold rounded-lg hover:bg-[#D4AF37]/10 transition-colors"
            >
              View Orders
            </Link>
          </div>
        </div>
        
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>© 2023 Luxe Gadgets. All rights reserved.</p>
          <p className="mt-1">Need help? Contact support@luxegadgets.com</p>
        </div>
      </div>
    </div>
  );
}