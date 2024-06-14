'use client';
import React, { useEffect, useState, Dispatch, SetStateAction}from 'react'
import { useUser } from '../context';
import {ethers} from 'ethers'
import { AccountContractAddress,CrowdFundingAddress} from '../../config'
import AccountABI from '../../../Backend/build/contracts/Account.json'
import CrowdFundABI from '../../../Backend/build/contracts/crowdFunding.json'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios'
import Create from './Create';
import Quote from './Quote';
import { BiSearch } from 'react-icons/bi'
import Feed from './Feed';
import Storybox from './Storybox'
import CreateBigStory from './CreateBigStory';
import StoryReader from './StoryReader';
import Campaign from './Campaign';
import CreateCampaign from './CreateCampaign';
import OptionReader from './OptionReader';

interface SidebarProps {
  pageNo: number | undefined;
  setPageNo: Dispatch<SetStateAction<number | undefined>>;
  currStory: any;
  setCurrStory:Dispatch<SetStateAction<any|undefined>>;
  currCampaign: any;
  setCurrCampaign:Dispatch<SetStateAction<any|undefined>>;
}
function Posts({pageNo,setPageNo,currStory,setCurrStory,currCampaign,setCurrCampaign}:SidebarProps) {
  const {user} = useUser();
  const [toggle,setToggle] = useState(true);
  const [searchQuery,setSearchQuery] = useState<string | undefined>('');
  const [posts, setPosts] = useState<any>({
    shortStoryPosts: [],
    quotePosts: []
  });

  const [bigStory,setBigStory]= useState<any>([]);
  const [campaign,setCampaign] = useState<any>([]);
  
  
  // const [abc,setabc] = useState<any>(8);
  // console.log("hello", setCurrStory)
  const [myPost,setMyPost] = useState<any>({
    shortStoryPosts: [],
    quotePosts: []
  })
  const [flagLike,setFlagLike] = useState<boolean | undefined>(false);
  const [shortStory,setShortStory] = useState<any>([]);
  const [quote,setQuote] = useState<any>([]);

  useEffect(()=>{
    if(pageNo == 3)
    {
          setShortStory(
              posts.shortStoryPosts.filter((post:any) => {
                const isNameMatch = searchQuery
                  ? post.name.value &&
                    typeof post.name.value === 'string' &&
                    post.name.value.toLowerCase().includes(searchQuery.toLowerCase())
                  : true;

                const isTopicMatch = searchQuery
                  ? post.Topic &&
                    post.Topic && 
                    typeof post.Topic === 'string' &&
                    post.Topic.toLowerCase().includes(searchQuery.toLowerCase())
                  : true;

                return isNameMatch || isTopicMatch;
              })
          );
    }
    else if(pageNo == 4)
    {
      setQuote(posts.quotePosts.filter((post:any)=>searchQuery ? (post.name.value && typeof post.name.value === 'string' && post.name.value.toLowerCase().includes(searchQuery.toLowerCase())) : true));
    }
  },[searchQuery])


  useEffect(() => {
    console.log(currStory);
  }, [currStory]);
  useEffect(() => {
    const fetchData = async () => {
      const ethereum = window.ethereum;
      if (ethereum) {
        console.log("Ethereum provider available");
      let chainId = await ethereum.request({method:'eth_chainId'})
      console.log('Connected to chainid:',chainId)
      const sepoliaChainId = '0xaa36a7';
      if(chainId !== sepoliaChainId)
      {
         console.log("Not connected to Correct network");
        //  setCorrectNetwork(false)
      }
      else{
        // setCorrectNetwork(true)
      }
      const accounts = await ethereum.request({
        method:'eth_requestAccounts'
      })
        // checkConnectedAcc(accounts[0])
        console.log(accounts[0]);

    } else {
      console.error("Ethereum provider not available");
    }

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const AccountContract = new ethers.Contract(
          AccountContractAddress,
          AccountABI.abi,
          signer
        );
        const CrowdFundContract = new ethers.Contract(
          CrowdFundingAddress,
          CrowdFundABI.abi,
          signer
        )
        
        const res = await AccountContract.getPostsByType("short story");
        const res1 = await AccountContract.getPostsByType("quote");
        const res3 = await CrowdFundContract.getBigStories();
        console.log(res);
        console.log(res3);
        const shortStoryPosts: any[] = await Promise.all(
          res.map(async (post: any) => {
            try {
              const response = await axios.get(
                `https://gateway.pinata.cloud/ipfs/${post.cid}`
              );
                
              const [name,profilePicture,accountOwnerAddr] = await AccountContract.getUserMetaData(post.Author);
              return {
                ...post,
                name: name,
                profilePicture:profilePicture,
                accountOwnerAddr:accountOwnerAddr,
                data: response.data,
              };
            } catch (error) {
              console.error('Error retrieving data:', error);
              return null; 
            }
          })
        );

        const quotePosts: any[] = await Promise.all(
          res1.map(async (post: any) => {
            try {
              const response = await axios.get(
                `https://gateway.pinata.cloud/ipfs/${post.cid}`
              );
        
              const [name,profilePicture,accountOwnerAddr] = await AccountContract.getUserMetaData(post.Author);
              return {
                ...post,
                name: name,
                profilePicture:profilePicture,
                accountOwnerAddr:accountOwnerAddr,
                data: response.data,
              };
            } catch (error) {
              console.error('Error retrieving data:', error);
              return null; 
            }
          })
        );

        // const bigStories: any[] = await Promise.all(
        //   res3.map(async (post: any) => {
        //     try {

        //       const response = await axios.get(
        //         `https://gateway.pinata.cloud/ipfs/${post.chapter.cid}`
        //       );
        //       return {
        //         ...post,
        //         data: response.data,
        //       };
        //     } catch (error) {
        //       console.error('Error retrieving data:', error);
        //       return null; 
        //     }
        //   })
        // );
        const filteredShortStoryPosts = shortStoryPosts.filter((post) => post !== null);
        const filteredMyShortStoryPosts = filteredShortStoryPosts.filter((post) => post.Author === user[1]);
        console.log("USER:"+user);
        console.log(user.accountOwnerAddr);
        const filteredOthersShortStoryPosts = filteredShortStoryPosts.filter((post) => post.Author !== user[1]);
        const filteredQuotesPosts = quotePosts.filter((post) => post !== null);
        const filteredMyQuotesPosts = filteredQuotesPosts.filter((post) => post.Author === user[1]);
        const filteredOthersQuotesPosts = filteredQuotesPosts.filter((post) => post.Author !== user[1]);
        const postsData:any = {
          shortStoryPosts: filteredOthersShortStoryPosts,
          quotePosts: filteredOthersQuotesPosts
        }; 
        const myPostsData:any = {
          shortStoryPosts: filteredMyShortStoryPosts,
          quotePosts: filteredMyQuotesPosts
        };
        setBigStory(res3);
        setShortStory(filteredOthersShortStoryPosts);
        setQuote(filteredOthersQuotesPosts);
        setPosts(postsData);
        setMyPost(myPostsData);
      }
    };
    fetchData();
  }, [flagLike]);

  return (
    <div className="h-screen">
      { (pageNo === 3 || pageNo === 4) && (
            <div className='flex-[1] p-4'>
              <div className='flex items-center bg-[#243340] p-2 rounded-3xl'>
              <div className='text-[#8899a6] mr-2'>
                <BiSearch />
              </div>
                <input
                  placeholder='Search Story/User'
                  type='text'
                  className='bg-transparent outline-none text-white'
                  onChange={(e)=>setSearchQuery(e.target.value)}
                  value={searchQuery}
                />
              </div>
            </div>
      )}

      {pageNo === 5 &&
        <div className='flex items-center justify-between'>
        <h1 className='mt-4 text-white font-serif font-bold ml-10'></h1>
        <button onClick={()=>setPageNo(6)} className='p-1 bg-green-600 text-black rounded-md mt-3 text-md font-serif mr-5'><FontAwesomeIcon icon={faPlus} className='mr-2'/>Create Story</button>
      </div>
      }
        
      {
      pageNo == 0 &&
        <div className='flex-[1] p-4 '>
          <div className='flex rounded-lg text-white items-center justify-center mt-3'>
            <div onClick={()=>setToggle(true)} className={toggle ?'w-80 h-10 bg-slate-950 text-center text-sm pt-2 cursor-pointer rounded':'w-80 h-10 bg-slate-800 text-center text-sm pt-2 cursor-pointer rounded'}>Short Story</div>
            <div onClick={()=>setToggle(false)} className={toggle ?'w-80 h-10 bg-slate-800 text-center text-sm pt-2 cursor-pointer rounded':'w-80 h-10 bg-slate-950 text-center text-sm pt-2 cursor-pointer rounded'}>Quotes</div>
          </div>
        </div>       
      }
      <div className={(pageNo == 1 || pageNo == 2 || pageNo == 6) || pageNo == 7 || pageNo == 8 || pageNo == 9 || pageNo == 10 ? 'overflow-y-scroll no-scrollbar h-full':'overflow-y-scroll no-scrollbar h-5/6'}>  
      {
        pageNo === 0 && toggle &&  myPost.shortStoryPosts.map((post:any, index:number) => (<Feed key={index} post={post} flagLike={flagLike} setFlagLike={setFlagLike}/>))
      }
      {
        pageNo === 0 && !toggle && myPost.quotePosts.map((post:any, index:number) => (<Feed key={index} post={post} flagLike={flagLike} setFlagLike={setFlagLike}/>))
      }
      {
        pageNo === 1 && <Create setFlagLike={setFlagLike} flagLike = {flagLike}/>
      }
      {
        pageNo === 2 && <Quote setFlagLike={setFlagLike} flagLike = {flagLike}/>
      }
      {
        pageNo === 3 && shortStory.map((post: any , index:number) => (<Feed key={index} post={post} flagLike={flagLike} setFlagLike={setFlagLike}/>))
      }
      {
        pageNo === 4 && quote.map((post:any, index:number) => (<Feed key={index} post={post} flagLike={flagLike} setFlagLike={setFlagLike}/>))
      }

      {  
        pageNo === 5 && <div className="container mx-auto py-8">
        <div className="flex flex-wrap">
          {bigStory.map((story:any, index:number) => (
            <Storybox key={index} story={[story]} pageNo={pageNo} setPageNo={setPageNo} setCurrStory={setCurrStory} currStory={currStory}/>
          ))}
        </div>
      </div>
      }

      {
        pageNo === 6 && <CreateBigStory pageNo={pageNo} setPageNo={setPageNo} flagLike={flagLike} setFlagLike={setFlagLike}/>
      }

      {
        pageNo === 7 && <StoryReader pageNo={pageNo} setPageNo={setPageNo} currStory={currStory} />
      }

      {
        pageNo === 8 && <Campaign pageNo={pageNo} setPageNo={setPageNo} storyNo={ethers.BigNumber.from(currStory.storyNo._hex).toNumber()} chapterNo={ethers.BigNumber.from(currStory.totalChapters._hex).toNumber()+1} storyName={currStory.storyName} deadline = {ethers.BigNumber.from(currStory.deadline._hex).toNumber()} timestamp ={ethers.BigNumber.from(currStory.timestamp._hex).toNumber()} setCurrCampaign={setCurrCampaign} currCampaign={currCampaign}/>
      }

      {
        pageNo === 9 && <CreateCampaign pageNo={pageNo} setPageNo={setPageNo} flagLike={flagLike} setFlagLike={setFlagLike} storyNo={ethers.BigNumber.from(currStory.storyNo._hex).toNumber()} chapterNo={ethers.BigNumber.from(currStory.totalChapters._hex).toNumber()+1} storyName={currStory.storyName}/>
      }

      {
        pageNo === 10 && <OptionReader pageNo={pageNo} setPageNo={setPageNo} currCampaign={currCampaign} storyNo={ethers.BigNumber.from(currStory.storyNo._hex).toNumber()} chapterNo={ethers.BigNumber.from(currStory.totalChapters._hex).toNumber()+1}/>
      }
      </div>
    </div>

    
      
  )
}

export default Posts
