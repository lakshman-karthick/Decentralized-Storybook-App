'use client';
import React, { useEffect, useState, Dispatch, SetStateAction}from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight,faCaretLeft, faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios'
interface SidebarProps {
    pageNo: number | undefined;
    setPageNo: Dispatch<SetStateAction<number | undefined>>;
    currStory:any;
}
function StoryReader({pageNo,setPageNo,currStory}:SidebarProps) {
  console.log(currStory.storyNo)
  const [chapterNo,setChapterNo] = useState(0)
  const [data,setData]= useState('');
  const [chapAvail,setChapAvail] = useState(true);
  useEffect(()=>{
    const fetchData =async ()=>{
      console.log("Fetch Data Function is Running !!!")
      try{
        const response =await axios.get(
          `https://gateway.pinata.cloud/ipfs/${currStory.chapter[chapterNo].cid}`
        );
        console.log(response.data);
        setData(response.data);
      }catch(err){
        console.log(err);
      }
    }
    if( chapterNo < currStory.totalChapters && currStory.chapter[chapterNo])
    {
      setChapAvail(true);
      fetchData();
    }
    else
    {
      setChapAvail(false);
      setData("No More Chapters. If you have something to continue this story. Don't wait, Start your Campaign with your own Chapter.")
    }
    
  },[chapterNo])
  return (
    <div>
      <div className='w-5/6 h-screen ml-16 bg-black rounded '>
        <div className='w-full bg-black h-[8%] rounded justify-between items-center flex'><div><FontAwesomeIcon onClick={()=>setPageNo(5)} className='cursor-pointer pr-3' color='white' icon={faArrowLeft} size='xl'/></div><div className='text-white bg-gray-800 rounded flex pt-0.5 pb-0.5 pr-2 pl-2'>{chapterNo > 0 && <FontAwesomeIcon onClick={() => setChapterNo(prevChapterNo => prevChapterNo - 1)}  className='cursor-pointer' icon={faCaretLeft} color='white' size='xl' />}<p className='text-white font-bold pl-3 pr-3'>Chapter {chapterNo+1}</p>{chapAvail && <FontAwesomeIcon onClick={() =>setChapterNo(prevChapterNo => prevChapterNo + 1)}  className='cursor-pointer' icon={faCaretRight} color='white' size='xl' />}</div><div></div></div>
        {chapAvail ? 
        <div className='w-full bg-gray-900 h-[92%] rounded text-white overflow-y-scroll no-scrollbar p-4 pl-4'>{data}</div>
        :<div className='w-full bg-gray-900 h-[92%] rounded text-white overflow-y-scroll no-scrollbar p-4 items-center flex justify-center'>
          <div className='w-[50%] p-4 rounded bg-gray-800 font-bold'>
            <div className='text-center'>{data}</div>
            <div className='items-center justify-center flex'>
            <button className="mt-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Start Campaign for Chapter-{chapterNo+1}
            </button>
            </div>
          </div>
        </div>}
        </div>
      </div>
  )
}

export default StoryReader
