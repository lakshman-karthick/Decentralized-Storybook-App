"use client";
import React,{useState} from 'react'
import Sidebar from '@/app/components/Sidebar'
import dynamic from 'next/dynamic';

function page() {

  const [pageNo, setPageNo] = useState<number | undefined>(0);
  const [currStory,setCurrStory] = useState<any>(null);
  const [currCampaign,setCurrCampaign] = useState<any>(null);

const PostsNoHydration = dynamic(() => import('@/app/components/Posts'), {
  ssr: false,
});

const ProfileNoHydration = dynamic(() => import('@/app/components/Profile'), {
  ssr: false,
});

  return (
    
      <div className="flex text-black">
      <div className="w-1/6 bg-slate-950  h-dvh">
        <Sidebar setPageNo={setPageNo} pageNo={pageNo}/>
      </div>
      <div className="w-3/4 bg-slate-900  h-dvh">
        <PostsNoHydration pageNo={pageNo} setPageNo={setPageNo} currStory={currStory} setCurrStory={setCurrStory} currCampaign = {currCampaign} setCurrCampaign={setCurrCampaign}/>
      </div>
      <div className="w-1/4 bg-slate-950  h-dvh">
        <ProfileNoHydration/>
      </div>
    </div>
    
  )
}

export default page


// Contract - TimeStamp in CrowdFund