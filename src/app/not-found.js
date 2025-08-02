// app/not-found.tsx or app/not-found.jsx
"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-white text-gray-800">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-6">Oops! Page not found.</p>
      <Link
        href="/"
        className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
      >
        Go Home
      </Link>
    </div>
  );
}
