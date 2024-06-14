import {ethers} from 'ethers'
import React, { useEffect, useState, Dispatch, SetStateAction}from 'react'
import StoryReader from './StoryReader';
interface SidebarProps {
    story:any;
    pageNo: number | undefined;
    setPageNo: Dispatch<SetStateAction<number | undefined>>;
    setCurrStory:Dispatch<SetStateAction<any | undefined>>;
    currStory:any;
}

const Storybox = ({ story,pageNo,setPageNo,setCurrStory,currStory }:SidebarProps) => {
  // console.log(story)
  
  const fetchCurr = (no:number) => {
    // Directly set the current story using setCurrStory
    console.log(story[0])
    setCurrStory(story[0]);
    setPageNo(no);
};
  return (
    <div className="w-[45%] p-4">
      <div className="bg-slate-950 rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-white leading-10">{story[0].storyName}</h2>
        <p className="text-gray-300 text-sm mb-2 leading-8">{story[0].genre}</p>
        <p className="text-gray-300 text-sm mb-2 leading-8">Total Chapters: {story[0].totalChapters && story[0].totalChapters._hex && ethers.BigNumber.from(story[0].totalChapters._hex).toNumber() !== null? ethers.BigNumber.from(story[0].totalChapters._hex).toNumber(): 0}</p>
        <div className='flex flex-wrap items-center justify-between'>
        <button onClick={()=>fetchCurr(7)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Start Reading
        </button>
        <button onClick={()=>fetchCurr(8)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Campaign
        </button>
        </div>
        
      </div>
     
    </div>
  );
};

export default Storybox;
