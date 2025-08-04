"use client"
import { Suspense } from "react"
import SignUp from "@/components/auth/signup"
const Page = () => {
  return (
      <Suspense fallback={<div>Loading...</div>}>
      <SignUp />
      </Suspense>
  )
}

export default Page