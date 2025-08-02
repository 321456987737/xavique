import React from 'react'
import Image from 'next/image'
const Navbar = () => {
  return (
    <div className='h-[58px] sticky top-0 bg-[#0A0A0A] w-full text-white'>
      <div className='overflow-hidden h-[58px] flex items-center justify-between '>
         <Image src="/xavique.png" alt="Xavique Logo" className=' w-[160px] '    width={10000} height={0} />
      </div>
      <div>

      </div>
      <div></div>
      <div></div>
    </div>
  )
}

export default Navbar