"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
// Define Zod schema for form validation
const signUpSchema = z.object({
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  email: z.string()
    .email("Please enter a valid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    // .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")
});

export default function SignUp() {
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const { 
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(signUpSchema),
    mode: "onBlur"
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setApiError("");
    setSuccess(false);

    try {
      const res = await axios.post("/api/auth/signup", data, {
        timeout: 10000,
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (res.status === 201 || res.data.success) {
        router.push("/signin");
        setSuccess(true);
        reset();
      } else {
        throw new Error(res.data.message || "Signup failed. Please try again.");
      }
    } catch (err) {
      let errorMessage = "Something went wrong. Please try again.";

      if (axios.isAxiosError(err)) {
        if (err.response) {
          // Handle server validation errors
          if (err.response.data?.errors) {
            errorMessage = err.response.data.errors
              .map(error => error.msg)
              .join(". ");
          } else {
            errorMessage = err.response.data?.message || errorMessage;
          }
        } else if (err.request) {
          errorMessage = "Network error. Please check your connection.";
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setApiError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      // initial={{ opacity: 0, y: 60 }}
      // animate={{ opacity: 1, y: 0 }}
      // transition={{ type: "spring", duration: 0.7 }}
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "#0A0A0A" }}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6 relative"
        style={{ backgroundColor: "#2E2E2E", color: "#F6F5F3" }}
      >
        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-2xl flex items-center justify-center z-10">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="border-4 border-t-transparent border-[#D4AF37] rounded-full h-10 w-10"
            />
          </div>
        )}

        <div className="w-full flex items-center justify-center">
         <Link href={"/"}>
          <img
            src="/xavique.png"
            alt="Xavique Logo"
            className="w-auto h-[40px] object-contain"
            />
            </Link>
        </div>

        <h2 className="text-3xl font-bold text-center">Create Account</h2>

        {apiError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 py-2 rounded-md text-sm"
            style={{ backgroundColor: "#5A1A17", color: "white" }}
          >
            {apiError}
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 py-2 rounded-md text-sm"
            style={{ backgroundColor: "#16a34a", color: "white" }}
          >
            Account created successfully! Please check your email to verify your account.
          </motion.div>
        )}

        <div>
          <label className="block mb-1 text-sm font-medium">Username</label>
          <input
            {...register("username")}
            type="text"
            placeholder="john_doe"
            className={`w-full p-3 rounded-md text-white placeholder-gray-400 outline-none focus:ring-2 ${
              errors.username ? "border-red-500" : "border-[#D4AF37]"
            }`}
            style={{
              backgroundColor: "#0A0A0A",
              color: "#F6F5F3",
            }}
            disabled={loading}
          />
          {errors.username && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="text-red-400 text-xs mt-1"
            >
              {errors.username.message}
            </motion.p>
          )}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Email</label>
          <input
            {...register("email")}
            type="email"
            placeholder="you@example.com"
            className={`w-full p-3 rounded-md text-white placeholder-gray-400 outline-none focus:ring-2 ${
              errors.email ? "border-red-500" : "border-[#D4AF37]"
            }`}
            style={{
              backgroundColor: "#0A0A0A",
              color: "#F6F5F3",
            }}
            disabled={loading}
          />
          {errors.email && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="text-red-400 text-xs mt-1"
            >
              {errors.email.message}
            </motion.p>
          )}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Password</label>
          <input
            {...register("password")}
            type="password"
            placeholder="••••••••"
            className={`w-full p-3 rounded-md text-white placeholder-gray-400 outline-none focus:ring-2 ${
              errors.password ? "border-red-500" : "border-[#D4AF37]"
            }`}
            style={{
              backgroundColor: "#0A0A0A",
              color: "#F6F5F3",
            }}
            disabled={loading}
          />
          {errors.password && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="text-red-400 text-xs mt-1"
            >
              {errors.password.message}
            </motion.p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center font-semibold py-3 rounded-md transition-all duration-300 hover:brightness-110 relative overflow-hidden"
          style={{
            backgroundColor: "#D4AF37",
            color: "#0A0A0A",
          }}
        >
          <span className={`${loading ? "opacity-0" : "opacity-100"}`}>
            Sign Up
          </span>
          {loading && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute"
            >
              Creating Account...
            </motion.span>
          )}
        </button>

        <p className="text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="text-[#D4AF37] hover:underline"
            style={{ cursor: loading ? "not-allowed" : "pointer" }}
          >
            Log in
          </Link>
        </p>
      </form>
    </motion.div>
  );
}