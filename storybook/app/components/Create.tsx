'use client';
import React, { useState,Dispatch, SetStateAction } from 'react'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faPlus} from '@fortawesome/free-solid-svg-icons';
import {ethers} from 'ethers'
import { AccountContractAddress } from '../../config'
import AccountABI from '../../../Backend/build/contracts/Account.json'
import { useUser } from '../context';

declare global {
  interface Window {
    ethereum?: any;
  }
}

interface CreateProps {
  flagLike: boolean | undefined;
  setFlagLike :Dispatch<SetStateAction<boolean | undefined>>;
}
const JWT = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI1YjFiNGE2Ni03MWQyLTQwYzctOTE0Zi0wNjgxNTc0MDA1MDMiLCJlbWFpbCI6Imxha3NobWFua2FydGhpY2t0QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJiYjk4ZjAwYjAyMGI0OTE2ZmRlNyIsInNjb3BlZEtleVNlY3JldCI6IjIyZWEwOTQ3MTJmYTc3MTRmMzEzYWJlNTYwZjFlZDQ0YWM4NjM4NTk5OGU4NjE3OTVlNWFmNjU1NTY4OGU0YTQiLCJpYXQiOjE3MDc2NzYxMjZ9.V_l6YNjooDMumQ834PiSWA7Fw-gqQHIDTfdVgAXRms4'
function Create({setFlagLike,flagLike}:CreateProps) {
  const { user, updateUser,connectedAcc} = useUser();
  const [story, setStory] = useState('');
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [isPopUp, setPopup] = useState(false);
  console.log(connectedAcc)
  const createPost = async () => {
    try {
      const blobStory = new Blob([story], { type: 'text/plain' });
  
      const formData = new FormData();
      formData.append('file', blobStory);
  
      console.log("hii");
  
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


  
      console.log("jii");
      if (ethereum) {
        // Initialize Ethereum provider and signer
        const provider = new ethers.providers.Web3Provider(ethereum);
        console.log("lii");
        const signer = provider.getSigner();
        console.log("fii");
        // Create contract instance
        const AccountContract = new ethers.Contract(
          AccountContractAddress,
          AccountABI.abi,
          signer
        );
        console.log("aii");
        // Call addPosts function and wait for the result
        const res = await AccountContract.addPosts(hash, "short story", title, genre);
        console.log("tii");
        console.log('Ethereum Response:', res);
        console.log("Post Created Successfully");
        await res.wait();
        const res1 = await AccountContract.printAccountDetails(user[1]);
        
        updateUser(res1);
        setFlagLike(!flagLike);
        // Reset form and show popup
        setStory('');
        setTitle('');
        setGenre('');
        setPopup(true);
      }
    } catch (err) {
      console.error('Error:', err);
      // Handle errors appropriately (e.g., show an error message to the user)
    }
  };
  



  

  return (
    <div>
      <div className='flex items-center justify-around'>
        <h1 className='mt-4 text-white font-serif font-bold ml-28'>SHORT STORIES</h1>
        <button onClick={createPost} className='p-1 bg-green-600 text-black rounded-md mt-3 text-md font-serif'><FontAwesomeIcon icon={faPlus} className='mr-2'/>Create Story</button>
      </div>
      <div className='mt-6 w-5/6 h-[85vh] ml-16 bg-black rounded'>
  <div className='w-full justify-center items-center flex'>
    <input
      type="text"
      className="w-5/6 mt-4 p-2 pl-4 border rounded-md"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      placeholder="Story Title..."
    />
  </div>
  <div className='w-full justify-center items-center flex'>
    <input
      type="text"
      className="w-5/6 mt-4 p-2 pl-4 border rounded-md"
      value={genre}
      onChange={(e) => setGenre(e.target.value)}
      placeholder="Story Genre..."
    />
  </div>
  <div className='w-full h-[60vh] mt-5 justify-center items-center flex'>
    <textarea
      className="w-5/6 h-full p-4 mt-0 border rounded-md resize-none"
      value={story}
      onChange={(e) => setStory(e.target.value)}
      placeholder="Write your story here..."
      style={{ whiteSpace: 'pre-line'}}
    />
  </div>
</div>
{
        isPopUp && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className='bg-white p-10 text-black rounded'>
              <h1 className='font-sans font-extrabold text-2xl'>Post Created Successfully</h1>
              <button className='bg-green-600 rounded p-2 pl-4 pr-4 font-bold ml-24 mt-5 ' onClick={()=>{setPopup(false)}}>Okay</button>
            </div>
          </div>
        )
      }
      </div>
     
      
  )
}

export default Create
