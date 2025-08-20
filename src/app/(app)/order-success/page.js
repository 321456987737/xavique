'use client';

import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cartStore";
import Link from "next/link";

export default function OrderSuccessPage() {
  const { clearCart } = useCartStore();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    clearCart();

    const fetchOrder = async () => {
      try {
        const query = new URLSearchParams(window.location.search);
        const sessionId = query.get('session_id');

        if (sessionId) {
          const response = await fetch(`/api/orders?sessionId=${sessionId}`);
          const orderData = await response.json();
          setOrder(orderData);
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [clearCart]);

  if (loading) {
    return (
      <div className="min-h-screen pt-[120px] bg-[#0A0A0A] py-12 px-4 flex items-center justify-center">
        <div className="text-white text-xl">Loading order details...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[120px] bg-[#0A0A0A] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl flex flex-col justify-center items-center mx-auto">

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-[#D4AF37] to-[#F5E8B5] w-10 h-10 rounded-full flex items-center justify-center mr-3">
              <span className="text-[#0A0A0A] font-bold text-xl">L</span>
            </div>
            <h1 className="text-2xl font-bold text-white">LUXE GADGETS</h1>
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#1A1A1A] rounded-xl shadow-xl overflow-hidden border border-gray-800 p-8 w-full">
          {/* Success icon */}
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

          {/* Order details */}
          {order && (
            <div className="text-left mb-6">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-[#D4AF37] mb-2">
                  Order Summary
                </h2>
                <p className="text-gray-300">Order #: {order.id}</p>
                <p className="text-gray-300">Total: ${order.total.toFixed(2)}</p>
                <p className="text-gray-300">Payment Method: {order.paymentMethod}</p>
                <p className="text-gray-300">Status: {order.status}</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-[#D4AF37] mb-2">
                  Shipping To
                </h2>
                <p className="text-gray-300">
                  {JSON.parse(order.customer).name}<br />
                  {JSON.parse(order.customer).address.line1}<br />
                  {JSON.parse(order.customer).address.city},{" "}
                  {JSON.parse(order.customer).address.country}
                </p>
              </div>
            </div>
          )}

          {/* Confirmation message */}
          <h1 className="text-3xl font-bold text-white mb-4 text-center">
            Order Confirmed!
          </h1>
          <p className="text-gray-300 mb-8 max-w-md mx-auto text-center">
            Thank you for your purchase. Your order has been confirmed and will be processed shortly.
            A confirmation email has been sent to your email address.
          </p>

          {/* Buttons */}
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

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>© 2023 Luxe Gadgets. All rights reserved.</p>
          <p className="mt-1">Need help? Contact support@luxegadgets.com</p>
        </div>
      </div>
    </div>
  );
}
