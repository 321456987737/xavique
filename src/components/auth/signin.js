"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { motion } from "framer-motion";

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export default function SignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Check for URL error parameters on component mount
  useEffect(() => {
    const urlError = searchParams.get('error');
    if (urlError) {
      switch (urlError) {
        case 'CredentialsSignin':
          setError('Invalid email or password. Please check your credentials and try again.');
          break;
        case 'Configuration':
          setError('There is a problem with the server configuration.');
          break;
        case 'AccessDenied':
          setError('Access denied. You do not have permission to sign in.');
          break;
        case 'Verification':
          setError('The verification token has expired or has already been used.');
          break;
        default:
          setError('An error occurred during sign in. Please try again.');
      }
    }
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");
    
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });
      
      if (result?.ok) {
        router.push("/collection");
      } else if (result?.error) {
        // Handle different types of authentication errors
        switch (result.error) {
          case 'CredentialsSignin':
            setError("Invalid email or password. Please check your credentials and try again.");
            break;
          case 'Configuration':
            setError("There is a problem with the server configuration. Please contact support.");
            break;
          case 'AccessDenied':
            setError("Access denied. You do not have permission to sign in.");
            break;
          case 'Verification':
            setError("The verification token has expired or has already been used.");
            break;
          default:
            setError(`Authentication failed: ${result.error}`);
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } catch (err) {
      console.error("Sign in error:", err);
      setError("A network error occurred. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6 bg-[#2E2E2E]"
        style={{ backgroundColor: "#2E2E2E", color: "#F6F5F3" }}
      >
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
          <Link href="/">
            <img src="/xavique.png" alt="Xavique Logo" className="w-auto h-[40px] object-contain" />
          </Link>
        </div>

        <h2 className="text-3xl font-bold text-center">Sign In</h2>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 py-2 rounded-md text-sm"
            style={{ backgroundColor: "#5A1A17", color: "white" }}
          >
            {error}
          </motion.div>
        )}

        <div>
          <label className="block mb-1 text-sm font-medium">Email</label>
          <input
            {...register("email")}
            type="email"
            placeholder="you@example.com"
            className={`w-full p-3 rounded-md text-white placeholder-gray-400 outline-none focus:ring-2 ${
              errors.email ? "border-red-500" : "border-[#D4AF37]"
            }`}
            style={{ backgroundColor: "#0A0A0A", color: "#F6F5F3" }}
            disabled={loading}
          />
          {errors.email && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-xs mt-1">
              {errors.email.message}
            </motion.p>
          )}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Password</label>
          <div className="relative">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className={`w-full p-3 rounded-md text-white placeholder-gray-400 outline-none focus:ring-2 ${
                errors.password ? "border-red-500" : "border-[#D4AF37]"
              }`}
              style={{ backgroundColor: "#0A0A0A", color: "#F6F5F3" }}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#D4AF37]"
              disabled={loading}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
          {errors.password && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-xs mt-1">
              {errors.password.message}
            </motion.p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm">
            <Link
              href="/forgot-password"
              className="text-[#D4AF37] hover:underline"
              style={{ cursor: loading ? "not-allowed" : "pointer" }}
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center font-semibold py-3 rounded-md transition-all duration-300 hover:brightness-110 relative overflow-hidden"
          style={{ backgroundColor: "#D4AF37", color: "#0A0A0A" }}
        >
          <span className={`${loading ? "opacity-0" : "opacity-100"}`}>Sign In</span>
          {loading && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute">
              Signing In...
            </motion.span>
          )}
        </button>

        <p className="text-center text-sm text-gray-400">
          Don’t have an account?{" "}
          <Link
            href="/signup"
            className="text-[#D4AF37] hover:underline"
            style={{ cursor: loading ? "not-allowed" : "pointer" }}
          >
            Sign up
          </Link>
        </p>
      </form>
    </motion.div>
  );
}
