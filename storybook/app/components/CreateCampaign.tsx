'use client';
import React,{useState,Dispatch,SetStateAction} from 'react'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import {ethers} from 'ethers'
import {CrowdFundingAddress } from '../../config'
import CrowdFundABI from '../../../Backend/build/contracts/crowdFunding.json'

interface SidebarProps {
    pageNo: number | undefined;
    setPageNo: Dispatch<SetStateAction<number | undefined>>;
    flagLike: boolean | undefined;
    setFlagLike :Dispatch<SetStateAction<boolean | undefined>>;
    storyNo: number|undefined;
    chapterNo: number|undefined;
    storyName : string | undefined;
}

declare global {
    interface Window {
      ethereum?: any;
    }
  }
  const JWT = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI1YjFiNGE2Ni03MWQyLTQwYzctOTE0Zi0wNjgxNTc0MDA1MDMiLCJlbWFpbCI6Imxha3NobWFua2FydGhpY2t0QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJiYjk4ZjAwYjAyMGI0OTE2ZmRlNyIsInNjb3BlZEtleVNlY3JldCI6IjIyZWEwOTQ3MTJmYTc3MTRmMzEzYWJlNTYwZjFlZDQ0YWM4NjM4NTk5OGU4NjE3OTVlNWFmNjU1NTY4OGU0YTQiLCJpYXQiOjE3MDc2NzYxMjZ9.V_l6YNjooDMumQ834PiSWA7Fw-gqQHIDTfdVgAXRms4'
  
function CreateCampaign({pageNo,setPageNo,flagLike,setFlagLike,storyNo,chapterNo,storyName}:SidebarProps) {
    const [story, setStory] = useState('');
    const [isPopUp, setPopup] = useState(false);
  
  
    const CreateCrowdFund = async () => {
      try {
        const blobStory = new Blob([story], { type: 'text/plain' });
        const formData = new FormData();
        formData.append('file', blobStory);
        const response = await axios.post(
          'https://api.pinata.cloud/pinning/pinFileToIPFS',
          formData,
          {
            headers: {
              'pinata_api_key': 'bb98f00b020b4916fde7',
              'pinata_secret_key': '22ea094712fa7714f313abe560f1ed44ac86385998e861795e5af6555688e4a4',
              Authorization: JWT,
            },
          }
        );
        
        console.log('Pinata Response:', response.data);
    
        const hash = response.data.IpfsHash.toString();
        console.log(hash);
    
        const ethereum = window.ethereum;
        if (ethereum) {
          console.log("Ethereum provider available");
        let chainId = await ethereum.request({method:'eth_chainId'})
        console.log('Connected to chainid:',chainId)
        const sepoliaChainId = '0xaa36a7';
        if(chainId !== sepoliaChainId)
        {
           console.log("Not connected to Correct network");
          
        }
        else{
          
        }
        const accounts = await ethereum.request({
          method:'eth_requestAccounts'
        })
          
          console.log(accounts[0]);
  
      } else {
        console.error("Ethereum provider not available");
      }
  
  
    
        console.log("jii");
        if (ethereum) {
          // Initialize Ethereum provider and signer
          const provider = new ethers.providers.Web3Provider(ethereum);
          console.log("lii");
          const signer = provider.getSigner();
          console.log("fii");
          // Create contract instance
        //   const AccountContract = new ethers.Contract(
        //     AccountContractAddress,
        //     AccountABI.abi,
        //     signer
        //   );
          const CrowdFundContract = new ethers.Contract(
            CrowdFundingAddress,
            CrowdFundABI.abi,
            signer
          );
          const res = await CrowdFundContract.CreateCrowdFund(storyNo,chapterNo,hash);
          console.log("Campaign Created Successfully");
          await res.wait();
        //   await AccountContract.incrementContributionCount(); 
          // const res1 = await CrowdFundContract.getBigStories();
          
          // updateUser(res1);
          setFlagLike(!flagLike);
          // Reset form and show popup
          setStory('');
          
          setPopup(true);
        }
      } catch (err) {
        console.error('Error:', err);
      }
    };
    
  
    return (
      <div>
        <div className='mt-6 w-5/6 h-[95vh] ml-16 bg-black rounded'>
          <div className='items-center flex justify-between pr-4 pt-4'>
          <div></div>
          <FontAwesomeIcon className='cursor-pointer' onClick={()=>setPageNo(8)} icon={faXmark} color='white' size='2xl'/>
          </div>
          <div className='text-center font-extrabold text-white  text-xl'>{storyName}</div>
      <div className='flex flex-wrap'>
    
    <div className='w-1/2 ml-10'>
        <div className='text-white'><b>Chapter No : </b>{chapterNo}</div>
    </div>
    </div>
    
    <div className='w-full h-[70vh] p-6 mt-1 justify-center items-center flex flex-center'>
      <textarea
        className="w-full h-full p-4 mt-0 border rounded-md resize-none"
        value={story}
        onChange={(e) => setStory(e.target.value)}
        placeholder="Write your story here..."
        style={{ whiteSpace: 'pre-line'}}
      />
    </div>
    <div className='items-center justify-center flex'>
    <button onClick={CreateCrowdFund} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded ">
          Create Campaign
     </button>
     </div>
      </div>
      {
          isPopUp && (
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
              <div className='bg-white p-10 text-black rounded'>
                <h1 className='font-sans font-extrabold text-2xl'>Story Created Successfully</h1>
                <button className='bg-green-600 rounded p-2 pl-4 pr-4 font-bold ml-24 mt-5 ' onClick={()=>{setPopup(false)}}>Okay</button>
              </div>
            </div>
          )
        }
      </div>
    )
}

export default CreateCampaign
