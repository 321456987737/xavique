import React from 'react'

const Page = async ({params}) => {
   const {category} = await params
  return (
    <div>Page{category}</div>
  )
}

export default Page