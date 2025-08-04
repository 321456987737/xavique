"use client"
import { SessionProvider } from "next-auth/react"

export default function Provider ({ children }) {
  return (
    <SessionProvider refetchInterval={5 * 60}>
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
    </SessionProvider>
  )
}