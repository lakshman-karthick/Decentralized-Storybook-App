import React from 'react'
import { format } from 'timeago.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faHeart, faMaximize, faMoneyBill} from '@fortawesome/free-solid-svg-icons';
import {ethers} from 'ethers'
import { AccountContractAddress} from '../../config'
import AccountABI from '../../../Backend/build/contracts/Account.json'

function Feed({post,flagLike,setFlagLike}:any) {
    function formatDateFromSeconds(timestamp: number): string {
        const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed, so add 1
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    const handleContribution = async (postid:any)=>{
        const ethereum = window.ethereum;
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const AccountContract = new ethers.Contract(
            AccountContractAddress,
            AccountABI.abi,
            signer
          );
          const amountInWei = ethers.utils.parseEther('0.01');
          const transaction = await AccountContract.addContribute(postid, { value: amountInWei });
          console.log(transaction)
          await transaction.wait();
          setFlagLike(!flagLike)
        }
      }
    
      const handleLike = async (postid:any)=>{
        const ethereum = window.ethereum;
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const AccountContract = new ethers.Contract(
            AccountContractAddress,
            AccountABI.abi,
            signer
          );
          const res = await AccountContract.addLike(postid);
          console.log(res)
          await res.wait();
          setFlagLike(!flagLike)
        }
      }

  return (
    <div>
       <div className='mt-8 w-3/4 h-[28rem] ml-28 bg-slate-950 rounded' key={post.postId}>
                    <div className=' h-12 justify-between items-center flex rounded'>
                      <div className='p-3 flex'>
                        <div className='rounded-full bg-white w-8 h-8'>
                          <img className='w-full h-full object-cover rounded-full' src={post.profilePicture} alt="user-profile" />
                        </div>
                        <h1 className='text-white ml-5 mt-1'>{post.name}</h1>
                        <span className='flex items-center text-sm text-[#8899a6] ml-1'>
                           @{post.accountOwnerAddr.slice(0,7)}  • {format(new Date(formatDateFromSeconds(parseInt(post.timestamp._hex, 16))).getTime())}
                        </span>
                      </div>
                      <FontAwesomeIcon icon={faMaximize} className="text-white w-5 h-5 mr-8 hover:w-6 hover:h-6 cursor-pointer" />
                    </div>
                    <div className='bg-slate-800 h-3/4 w-10/12 mt-3 ml-12 rounded-lg text-white'>
                     {post.Type == 'short story' && <div className='text-center pt-3 font-bold'>
                        {post.Topic}
                      </div>} 
                      <div className={post.Type == 'short story' ? 'overflow-y-scroll no-scrollbar h-[18rem] p-3 text-sm':'overflow-y-scroll no-scrollbar h-[18rem] p-3 font-bold text-base flex items-center justify-center'}>
                        {post.data}
                      </div>
                    </div>
                    <div className='flex justify-between items-center mt-5'>
                      <div onClick={()=>handleLike(post.postId)} className='flex ml-5 cursor-pointer'><FontAwesomeIcon icon={faHeart} className="text-white w-5 h-5 hover:text-red-600" /><p className='ml-3 text-white text-sm'>{post.like && post.like._hex && ethers.BigNumber.from(post.like._hex).toNumber() !== null? ethers.BigNumber.from(post.like._hex).toNumber(): 0} Likes</p></div>
                      <div className='flex cursor-pointer'><FontAwesomeIcon icon={faComment} className="text-white w-5 h-5 hover:text-blue-600" /><p className='ml-3 text-white text-sm'>Comment</p></div>
                      <div onClick={()=>handleContribution(post.postId)} className='flex mr-5 cursor-pointer'><FontAwesomeIcon icon={faMoneyBill} className="text-white w-5 h-5 hover:text-green-600" /><p className='ml-3 text-white text-sm'>{ post.contribution && post.contribution._hex? ethers.utils.formatEther(post.contribution._hex): "0.0"} ETH</p></div>
                    </div>
                  </div>
    </div>
  )
}

export default Feed
