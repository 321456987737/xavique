"use client"
import { Suspense } from "react"
import Signin from "@/components/auth/signin"
const Page = () => {
  return (
      <Suspense fallback={<div>Loading...</div>}>
      <Signin />
      </Suspense>
  )
}

export default Page