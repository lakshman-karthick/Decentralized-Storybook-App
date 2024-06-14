'use client';
import React, { Dispatch, SetStateAction,useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faHouse, faMoneyBill, faPlus, faQuoteLeft,faRightFromBracket,faUserPlus,faWindowRestore} from '@fortawesome/free-solid-svg-icons';
import { useUser } from '../context';
import { useRouter } from 'next/navigation'
interface SidebarProps {
  setPageNo: Dispatch<SetStateAction<number | undefined>>;
  pageNo : number | undefined;
}
function Sidebar({setPageNo,pageNo}:SidebarProps) {
  const router = useRouter();
 
  const [isCreateDropdownOpen, setCreateDropdownOpen] = useState(false);

  const handleCreateDropdown = () => {
    setCreateDropdownOpen(!isCreateDropdownOpen);
  };
  const {updateUser,checkLogin} = useUser();
  const handleLogout = ()=>{
      updateUser({});
      checkLogin(false);
      router.push('/pages/Login')
  }
  
  const handleHome = ()=>{
    setPageNo(0);
    router.push('/pages/Home')
  }

  

  const handlePage = (index:number | undefined)=>{
      setPageNo(index);
  }

  return (
    <div>
      <div className=' text-white'><h1 className='ml-7 mt-12 font-extrabold font-sans text-2xl cursor-pointer'>Storybook</h1></div>
      <div className='mt-16'>
        <div onClick={handleHome} className={pageNo == 0  ?'hover:bg-slate-800 pb-3 pt-3 mt-2 bg-slate-800':'hover:bg-slate-800 pb-3 pt-3 mt-2'}><div className=' flex ml-5 cursor-pointer'><FontAwesomeIcon icon={faHouse} className="text-white w-6 h-6" /><p className='text-white font-serif ml-2 font-medium text-sm mt-1'>Home</p></div></div>
        
        <div onClick={()=>handleCreateDropdown()} className='hover:bg-slate-800 pb-3 pt-3 mt-2'><div className=' flex ml-5 cursor-pointer'><FontAwesomeIcon icon={faPlus} className="text-white w-6 h-6" /><p className='text-white font-serif ml-2 font-medium text-sm mt-1'>Create</p></div></div>
        {isCreateDropdownOpen && (
          <div className="ml-0 mt -2 text-white text-sm">
            <div onClick={()=>handlePage(1)} className={pageNo == 1  ?'hover:bg-slate-800 pb-3 pt-3 mt-2 bg-slate-800 cursor-pointer':'hover:bg-slate-800 pb-3 pt-3 mt-2 cursor-pointer'}><div className='ml-5'>Short Story</div></div>
            <div onClick={()=>handlePage(2)} className={pageNo == 2  ?'hover:bg-slate-800 pb-3 pt-3 mt-2 bg-slate-800 cursor-pointer':'hover:bg-slate-800 pb-3 pt-3 mt-2 cursor-pointer'}><div className='ml-5'>Quotes</div></div>
          </div>
        )}
        
        <div onClick={()=>handlePage(3)} className={pageNo == 3  ?'hover:bg-slate-800 pb-3 pt-3 mt-2 bg-slate-800':'hover:bg-slate-800 pb-3 pt-3 mt-2'}><div className=' flex ml-5 cursor-pointer'><FontAwesomeIcon icon={faWindowRestore} className="text-white w-6 h-6" /><p className='text-white font-serif ml-2 font-medium text-sm mt-1'>Short Stories</p></div></div>
        <div onClick={()=>handlePage(4)} className={pageNo == 4  ?'hover:bg-slate-800 pb-3 pt-3 mt-2 bg-slate-800':'hover:bg-slate-800 pb-3 pt-3 mt-2'}><div className=' flex ml-5 cursor-pointer'><FontAwesomeIcon icon={faQuoteLeft} className="text-white w-6 h-6" /><p className='text-white font-serif ml-2 font-medium text-sm mt-1'>Quotes</p></div></div>
        <div onClick={()=>handlePage(5)} className='hover:bg-slate-800 pb-3 pt-3 mt-2'><div className=' flex ml-5 cursor-pointer'><FontAwesomeIcon icon={faBook} className="text-white w-6 h-6" /><p className='text-white font-serif ml-2 font-medium text-sm mt-1'>Contributions</p></div></div>
        <div onClick={handleLogout} className='hover:bg-slate-800 pb-3 pt-3 mt-2'><div className=' flex ml-5 cursor-pointer'><FontAwesomeIcon icon={faRightFromBracket} className="text-white w-6 h-6" /><p className='text-white font-serif ml-2 font-medium text-sm mt-1'>Logout</p></div></div>
        
      </div>
    </div>
  )
}

export default Sidebar
