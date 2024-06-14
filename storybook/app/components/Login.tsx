'use client';
import React, { useState,useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faRectangleXmark} from '@fortawesome/free-solid-svg-icons';
import { AccountContractAddress } from '../../config';
import {ethers} from 'ethers'
import AccountABI from '../../../Backend/build/contracts/Account.json'
import { useRouter } from 'next/navigation'
import { useUser } from '../context';

declare global {
  interface Window {
    ethereum?: any;
  }
}
function Login() {
  const { user, updateUser,connectedAcc,checkConnectedAcc ,isLogin,checkLogin} = useUser();
  
  const [isOpenLogin,setOpenLogin] = useState(false);
  const [isOpenSignup,setOpenSignup] = useState(false);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [bio, setBio] = useState('');
  const [correctNetwork,setCorrectNetwork] = useState(false);
  // const [connectedAccount,setConnectedAccount]=useState();
  const [isPopUp,setPopup] = useState(false);
  const [popupInfo,setPopupinfo] = useState('');
  // const [accInfo,setAccInfo] = useState();
  const router = useRouter();
  const [loginAvail,setLoginAvail] = useState(true);
  const [signupAvail,setSignupAvail] = useState(true);
  const [flag,setFlag] = useState(false);
  useEffect(()=>{
    connectWallet()
    getAccountDetails()
    const onAccountsChanged = () => {
      connectWallet();
      getAccountDetails();
    };
    window.ethereum && window.ethereum.on('accountsChanged', onAccountsChanged);
    return () => {
      window.ethereum && window.ethereum.removeListener('accountsChanged', onAccountsChanged);
    };

  },[connectedAcc,flag])

  const getAccountDetails = async () => {
    try {
      const ethereum = window.ethereum;
      if (ethereum && connectedAcc) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const AccountContract = new ethers.Contract(
          AccountContractAddress,
          AccountABI.abi,
          signer
        );
        console.log(AccountContract);
        console.log(provider.getCode('0x1C619346a5636da3E09966b6f0bEbc6E0ff121aC'));
        const res = await AccountContract.printAccountDetails(connectedAcc);
        updateUser(res);
        console.log(res)
        console.log(res);
        setLoginAvail(true);
        setSignupAvail(false);
      }
    } catch (error:any) {
      if (error.message && error.message.includes("Account does not exist")) {
        console.error("Account does not exist");
        setPopup(true);
        setPopupinfo("Account does not exist");
        setLoginAvail(false);
        setSignupAvail(true);
      } else {
        console.error(error);
      }
    }
  };
  
  
  const connectWallet = async ()=>{
    try{
      const ethereum = window.ethereum;
      if (ethereum) {
        console.log("Ethereum provider available");
        let chainId = await ethereum.request({method:'eth_chainId'})
        console.log('Connected to chainid:',chainId)
        const accounts = await ethereum.request({
          method:'eth_requestAccounts'
        })
          checkConnectedAcc(accounts[0])
          console.log("hi",accounts[0]);

      } else {
        console.error("Ethereum provider not available");
      }
    }catch(err){
      console.log(err);
    }

  }

  const handleLogin = async (e:any)=>{
      e.preventDefault();
      if(user && password === user['Password'])
      {
        checkLogin(true)
        router.push('/pages/Home');
      }
      else
      {
        setPopup(true);
        setPopupinfo('Password is Wrong. Try Again')
        setPassword('');
      }
  }

  const handleSignUp =async (e:any)=>{
      e.preventDefault();
      let accountDet = {
        name:name,
        accountOwnerAddr:connectedAcc,
        profilePicture:profileImage,
        Password:password,
        bio:bio
      }

      try{
        const ethereum = window.ethereum
        if(ethereum)
        {
          const provider = new ethers.providers.Web3Provider(ethereum)
          const signer = provider.getSigner()
          const AccountContract = new ethers.Contract(
            AccountContractAddress,
            AccountABI.abi,
            signer
          )
          await AccountContract.createAccount(accountDet.name,accountDet.profilePicture,accountDet.bio,accountDet.Password)
          .then((res:any)=>{
            console.log(res);
            res.wait();
            setPopup(true);
            setPopupinfo('Account Created successfully')
            setName('')
            setBio('')
            setPassword('')
            setProfileImage('')
            setFlag(!flag);
            setOpenSignup(false);
            setLoginAvail(true);
            setSignupAvail(false);
          
          })

        }
      }catch(err)
      {
        console.log(err);
      }

  }

  return (
    <div className='bg-slate-800 h-screen'>
      <div className='h-16 bg-slate-900 w-full'>
        <div className='flex justify-end'>
        {loginAvail && <button className='rounded bg-green-600 p-2  mt-3 mr-6' onClick={()=>setOpenLogin(!isOpenLogin)}>Login</button>}
        {signupAvail && <button className='rounded bg-green-600 p-2  mt-3 mr-6' onClick={()=>setOpenSignup(!isOpenSignup)}>Sign Up</button>}
        </div>
      </div>
      {/* <div className='text-white font-sans font-extrabold text-8xl flex justify-center items-center mt-24'> */}
      <div className='  bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500 font-sans font-extrabold text-8xl flex justify-center items-center mt-24'>
          <h1>Storybook</h1>
      </div>
      <div className='flex justify-center items-center mt-20'>
        <div className='bg-slate-900 p-6 rounded-lg shadow-md w-1/2 flex justify-center items-center leading-8'>
          <p>Explore a world of tales with our <b className='text-red-600'>Storybook App</b>. Where every page turns into a new adventure and imagination knows no bounds. Dive into enchanting stories anytime, anywhere.<b className='text-red-600'> Your journey into the extraordinary begins here.</b></p>
        </div>
      </div>
      {
        isOpenSignup && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
            <form  className="w-1/2 mx-auto mt-8 bg-white p-10 rounded shadow-md text-black">
              <div className='flex justify-end'><FontAwesomeIcon icon={faRectangleXmark} size='xl' onClick={()=>setOpenSignup(!isOpenSignup)} className='cursor-pointer'></FontAwesomeIcon></div>
              <div className='flex justify-center items-center'><h1 className='font-extrabold font-sans text-lg'>SIGNUP</h1></div>
      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-600 font-semibold">Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border-2 border-gray-300 p-2 rounded-md"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="password" className="block text-gray-600 font-semibold">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border-2 border-gray-300 p-2 rounded-md"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="profileImage" className="block text-gray-600 font-semibold">Profile Image URL:</label>
        <input
          type="text"
          id="profileImage"
          value={profileImage}
          onChange={(e) => setProfileImage(e.target.value)}
          className="w-full border-2 border-gray-300 p-2 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="bio" className="block text-gray-600 font-semibold">Bio:</label>
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full border-2 border-gray-300 p-2 rounded-md"
          
        />
      </div>
      <div className='flex justify-center items-center'>
      <button onClick={handleSignUp} type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 focus:outline-none">
        Submit
      </button>
      </div>
      
    </form>
        </div>
        )
      }

{
        isOpenLogin && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
            <form className="w-1/2 mx-auto mt-8 bg-white p-10 rounded shadow-md text-black">
              <div className='flex justify-end'><FontAwesomeIcon icon={faRectangleXmark} size='xl' onClick={()=>setOpenLogin(!isOpenLogin)} className='cursor-pointer'></FontAwesomeIcon></div>
              <div className='flex justify-center items-center'><h1 className='font-extrabold font-sans text-lg'>LOGIN</h1></div>
      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-600 font-semibold">Account No:</label>
        {/* <p>{connectedAccount}</p> */}
        <p>{user && user['accountOwnerAddr']}</p>
      </div>
      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-600 font-semibold">Name:</label>
        <p>{user && user['name']}</p>
      </div>

      <div className="mb-4">
        <label htmlFor="password" className="block text-gray-600 font-semibold">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border-2 border-gray-300 p-2 rounded-md"
          required
        />
      </div>

      
      <div className='flex justify-center items-center'>
      <button onClick={handleLogin} type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 focus:outline-none">
        Login
      </button>
      </div>
      
    </form>
        </div>
        )
      }

      {
        isPopUp && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className='bg-white p-10 text-black rounded'>
              <h1 className='font-sans font-extrabold text-2xl'>{popupInfo}</h1>
              <button className='bg-green-600 rounded p-2 pl-4 pr-4 font-bold ml-24 mt-5 ' onClick={()=>{setPopup(false)}}>Okay</button>
            </div>
          </div>
        )
      }
    </div>
  )
}

export default Login
