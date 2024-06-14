import React,{Dispatch,SetStateAction,useEffect,useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faArrowLeft, faDeleteLeft, faUserAstronaut, faX} from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import { CrowdFundingAddress } from '@/config';
import CrowdFundABI from '../../../Backend/build/contracts/crowdFunding.json'
import { ethers } from 'ethers';
interface SidebarProps {
    pageNo: number | undefined;
    setPageNo: Dispatch<SetStateAction<number | undefined>>;
    currCampaign:any;
    storyNo: number|undefined;
    chapterNo: number|undefined;
}

function OptionReader({pageNo,setPageNo,currCampaign,storyNo,chapterNo}:SidebarProps) {
  const [data,setData] = useState<string>();
  const [chapAvail,setChapAvail] = useState<boolean>(true);
  const [isPopUp,setPopup] = useState<boolean>(false);
  const [ether,setEther] = useState<any>(0);
  useEffect(()=>{
    const fetchData =async ()=>{
      console.log("Fetch Data Function is Running !!!")
      try{
        const response =await axios.get(
          `https://gateway.pinata.cloud/ipfs/${currCampaign.cid}`
        );
        console.log(response.data);
        setData(response.data);
      }catch(err){
        console.log(err);
      }
    }
    if(currCampaign)
    {
      setChapAvail(true);
      fetchData();
    }
    else
    {
      setChapAvail(false);
      setData("No More Chapters. If you have something to continue this story. Don't wait, Start your Campaign with your own Chapter.")
    }
    
  },[currCampaign])

  const donateOption = async ()=>{
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

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      
      const CrowdFundContract = new ethers.Contract(
        CrowdFundingAddress,
        CrowdFundABI.abi,
        signer
      )
      
      
      try {
        await CrowdFundContract.donateToCampaign(storyNo, chapterNo, ethers.BigNumber.from(currCampaign.optionNo._hex).toNumber(), {
          value: ethers.utils.parseEther(ether) // Assuming you want to send 0.1 ETH
        });
        // Code here will only execute after the donation transaction is confirmed
        console.log("Donation successful.");
      } catch (error) {
        // Handle error if donation transaction fails
        console.error("Error:", error);
      }
      setPopup(false);
      setEther(0);
      
      
     
    }
  }

  console.log(currCampaign)
  return (
    <div>
      <div className='w-5/6 h-screen ml-16 bg-black rounded'>
        <div className='w-full  h-[8%] rounded text-white flex items-center justify-between p-4 pl-4'>
          <div><FontAwesomeIcon onClick={()=>setPageNo(8)} className='cursor-pointer pr-3' color='white' icon={faArrowLeft} size='xl'/></div>
          <div>OPTION 1</div><div><button onClick={()=>setPopup(true)} className="mt-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded">
              Donate
            </button></div></div>
        <div className='w-full bg-slate-800 h-[92%] rounded text-white overflow-y-scroll no-scrollbar p-4 pl-4'>{data && data}</div>
        
    </div>
    {
          isPopUp && (
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
              
              <div className='bg-white p-5 text-black rounded'>
              <div className='flex items-center justify-between'>
                  <div></div>
                  <div></div>
                  <div><FontAwesomeIcon onClick={()=>{setPopup(false)}} className='cursor-pointer' icon={faDeleteLeft} size='xl' color='black'/></div>
              </div>
                <h1 className='font-sans mt-2 font-extrabold text-2xl'>Thank You For Your Support!!!</h1>
                <div className='flex items-center justify-between mt-8'><p>Ethers to Donate:</p><input onChange={(e) => setEther(e.target.value)} value={ether} type='number' step='0.01' min='0.0' className='border border-black'></input></div>
                <div className='flex items-center justify-between'>
                  <div></div>
                  <div><button className='bg-green-600 rounded p-2 pl-4 pr-4 font-bold mt-5 ' onClick={donateOption}>Donate</button></div>
                  <div></div>
                </div>
                
              </div>
            </div>
          )
        }
    </div>
  )
}

export default OptionReader
