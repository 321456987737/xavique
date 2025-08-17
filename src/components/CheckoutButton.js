"use client";

export default function CheckoutButton({ 
  onClick, 
  isLoading, 
  total 
}) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`w-full py-3 px-4 rounded-lg text-white font-bold ${
        isLoading
          ? "bg-gray-600 cursor-not-allowed"
          : "bg-gradient-to-r from-[#D4AF37] to-[#F5E8B5] hover:from-[#C19C30] hover:to-[#E5D7A5] text-[#0A0A0A]"
      } transition-all duration-200`}
    >
      {isLoading ? "Redirecting to Payment..." : `Pay $${total.toFixed(2)}`}
    </button>
  );
}