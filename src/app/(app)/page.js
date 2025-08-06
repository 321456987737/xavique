import React from 'react'
import Mainslider from '@/components/main/landingpage/mainslider'
import Topsuggestions from '@/components/main/landingpage/topsuggestions'
import Thirdsection from "@/components/main/landingpage/thirdsection"
import Services from '@/components/main/landingpage/services'
export default function Page() {
  return (
   <div className=' bg-[#0A0A0A]  w-full'>
      <div className='h-[90vh] w-full'>
      <Mainslider/>
      </div>
      <div className='mt-22'>
        <Topsuggestions/>
      </div>
      <div className='w-full '>
        <Thirdsection/>
      </div>
      <div className='w-full'>
      <Services/>
      </div>
   </div>
  )
}
