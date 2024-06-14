'use client';
import React, { useEffect, useState, Dispatch, SetStateAction}from 'react'
import {ethers} from 'ethers'
import {CrowdFundingAddress,AccountContractAddress} from '../../config'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus,faArrowLeft} from '@fortawesome/free-solid-svg-icons';

import AccountABI from '../../../Backend/build/contracts/Account.json'
import CrowdFundABI from '../../../Backend/build/contracts/crowdFunding.json'

interface SidebarProps {
    pageNo: number | undefined;
    setPageNo: Dispatch<SetStateAction<number | undefined>>;
    storyNo: number|undefined;
    chapterNo: number|undefined;
    storyName : string | undefined;
    deadline: number|undefined;
    timestamp: number|undefined;
    setCurrCampaign:Dispatch<SetStateAction<any | undefined>>;
    currCampaign : any;
  }
function Campaign({pageNo,setPageNo,storyNo,chapterNo,storyName,deadline,timestamp,setCurrCampaign,currCampaign}:SidebarProps) {
  function calculateDaysLeft(timestamp: number, deadline: number): number {
    const currentDate: Date = new Date();
    const deadlineDate: Date = new Date((timestamp + deadline * 24 * 60 * 60) * 1000);
    const differenceInTime: number = deadlineDate.getTime() - currentDate.getTime();
    const differenceInDays: number = Math.ceil(differenceInTime / (1000 * 3600 * 24)); // Convert milliseconds to days
    return differenceInDays > 0 ? differenceInDays : 0;
}

  
    console.log("StoryNo",storyNo);
    console.log("ChapterNo",chapterNo);
    const [crowdFundDet,setCrowdFundDet] = useState<any>();
    const [userMetaData,setUserMetaData] = useState<any>();
    // console.log(crowdFundDet && crowdFundDet.options);
    
    const readStory = (index:number)=>{
      setPageNo(10);
      setCurrCampaign(crowdFundDet.options[index]);
    }

    useEffect(()=>{
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
              
              const res =await CrowdFundContract.getCampaignByKey(storyNo,chapterNo);
              console.log(res);
              setCrowdFundDet(res);
              // setCurrCampaign(res);
              console.log(res.options[0])
              
              const AccountContract = new ethers.Contract(
                AccountContractAddress,
                AccountABI.abi,
                signer
              )
              const promises = res.options.map((cf:any) => AccountContract.getUserMetaData(cf.writer));
              const res1 = await Promise.all(promises);
              console.log(res1);
              setUserMetaData(res1);
              
              }
            }
            fetchData();
    },[storyNo, chapterNo])
  return (
    <div>
       <div className='w-11/12 h-screen ml-8 bg-black rounded'>
        <div className='items-center flex justify-between'>
        <div><FontAwesomeIcon onClick={()=>setPageNo(5)} className='cursor-pointer pr-3 ml-3' color='white' icon={faArrowLeft} size='xl'/></div>
        <div className='text-center font-extrabold text-white p-2 text-xl ml-20'>{storyName}</div>
        <button onClick={()=>setPageNo(9)} className='p-1 bg-green-600 text-black rounded-md mt-3 text-md font-serif mr-2'><FontAwesomeIcon icon={faPlus} className='mr-2'/>Create Campaign</button>
        </div>
        {
        crowdFundDet && crowdFundDet.crowdFundAvail === false  ?<div className='w-full bg-black h-[92%] rounded text-white overflow-y-scroll no-scrollbar p-4 items-center flex justify-center'>
        <div className='w-[50%] p-4 rounded bg-gray-800 font-bold'>
          <div className='text-center'>Campaign is not yet created.Be the one to create Campaign</div>
          <div className='items-center justify-center flex'>
          <button onClick={()=>setPageNo(9)} className="mt-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Start Campaign for Chapter-{chapterNo && chapterNo}
          </button>
          </div>
        </div>
      </div>:<div><div className='flex items-center justify-between w-full p-3 bg-gray-800 mt-3'>
        <div className="text-white text-sm"><b>Chapter No :</b> {chapterNo}</div>
       {timestamp && deadline &&
          <div className="text-white font-sm">
            <b>Deadline :</b> {new Date((timestamp + deadline * 24 * 60 * 60) * 1000).toLocaleDateString()} ({calculateDaysLeft(timestamp,deadline)} days more)
          </div>
        }

        {/* <div className="text-white text-sm"><b>Deadline:</b> 18/02/2002 (10 days more)</div> */}
        <div className="text-white text-sm"><b>Target :</b> {crowdFundDet && ethers.BigNumber.from(crowdFundDet.target._hex).toNumber()}</div>
      </div>
      <div className='flex flex-wrap ml-5'>
      {crowdFundDet && crowdFundDet.options.map((cf:any, index:number) => {
    return (
        <div key={index} className='pt-1 pb-3 p-2 bg-slate-800 mt-4 ml-7 rounded'>
            <div className='text-white text-center font-mono font-extrabold text-base'>
                OPTION {index + 1}
            </div>
            <div className='text-white font-sans text-sm mt-3 leading-7'>
                <table className='border-separate border-spacing-x-2'>
                    <tbody>
                        <tr className="text-white text-sm leading-7">
                            <td><strong>Author</strong></td>
                            <td><strong>:</strong></td>
                            <td>{userMetaData && userMetaData[index][0]}</td>
                        </tr>
                        <tr className="text-white text-sm leading-7">
                            <td><strong>Amount Collected</strong></td>
                            <td><strong>:</strong></td>
                            <td>{(ethers.BigNumber.from(cf.amtCollected._hex).div(ethers.BigNumber.from('1000000000000000000'))).toNumber()} ETH</td>
                        </tr>
                        <tr className="text-white text-sm leading-7">
                            <td><strong>Remaining Amount</strong></td>
                            <td><strong>:</strong></td>
                            <td>{crowdFundDet && ethers.BigNumber.from(crowdFundDet.target._hex).toNumber() - (ethers.BigNumber.from(cf.amtCollected._hex).div(ethers.BigNumber.from('1000000000000000000'))).toNumber()} ETH</td>
                        </tr>
                    </tbody>
                </table>
                <div className='flex items-center justify-center'>
                    <button onClick={()=>readStory(index)} className="text-sm mt-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded">
                        Read Story
                    </button>
                </div>
            </div>
        </div>
    );
})}
 
        
      </div>
      </div>
       }</div>
    </div>
  )
}

export default Campaign
