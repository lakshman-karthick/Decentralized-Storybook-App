import React from 'react'
import Sidebar from '@/app/components/Sidebar'
import Posts from '@/app/components/Posts'
import Create from '@/app/components/Create'
function page() {
  return (
    <div>
      <div className="flex text-black">
      <div className="w-1/6 bg-slate-950  h-dvh">
        {/* <Sidebar/> */}
      </div>
      <div className="w-3/4 bg-slate-900  h-dvh">
        {/* <Create/> */}
      </div>
      <div className="w-1/4 bg-slate-950  h-dvh">
        <div className="w-full"></div>
      </div>
    </div>
    </div>
  )
}

export default page