import React from 'react'
import Mainslider from '@/components/main/landingpage/mainslider'
import Topsuggestions from '@/components/main/landingpage/topsuggestions'
export default function Page() {
  return (
   <div className='h-[3000px] bg-[#0A0A0A]  w-full'>
      <div className='h-[90vh] w-full'>
      <Mainslider/>
      </div>
      <div className='mt-22'>
        <Topsuggestions/>
      </div>
   </div>
  )
}
