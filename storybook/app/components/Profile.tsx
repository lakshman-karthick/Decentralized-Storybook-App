"use client";
import React, { useEffect, useState } from 'react';
import { useUser } from '../context';

function Profile() {
  const { user } = useUser();
  const [pic, setPic] = useState();
  const [postCount,setPostCount] = useState<number | undefined>(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPic(user[2]);
    }
  }, [user]);

  return (
    <div>
      <div className='rounded-full w-32 h-32 ml-20 border-slate-800 border-4 mt-4'>
        <img
          src={pic}
          alt="User Profile"
          className='w-full h-full object-cover rounded-full'
        />
      </div>

      <div className='text-center ml-7 font-bold text-white mt-3'>
        {user[0]}
      </div>
      <div className="bg-gray-800 p-2 rounded-md shadow-md mt-5 w-11/12 ml-4 overflow-y-scroll no-scrollbar h-[20rem]">
  <div style={{ whiteSpace: 'pre-line' }} className="text-white text-sm leading-8">
    <div className='ml-4'><div><strong>Bio:</strong></div><div> {user[3]}</div></div>
     </div>
     <div className='bg-slate-950 p-6 w-100  rounded mt-2'>
     <table className='border-separate border-spacing-x-2'>
  <tbody>
    <tr className="text-white text-sm leading-10">
      <td ><strong>Post Count</strong></td>
      <td ><strong>:</strong></td>
      <td >{user[5] && (user[5]._hex ? String(parseInt(user[5]._hex, 16)) : (user[5].hex ? String(parseInt(user[5].hex, 16)) : 'N/A'))}</td>
    </tr>
    <tr className="text-white text-sm leading-10">
      <td><strong>Short Story Count</strong></td>
      <td><strong>:</strong></td>
      <td>{user[6] && (user[6]._hex ? String(parseInt(user[6]._hex, 16)) : (user[6].hex ? String(parseInt(user[6].hex, 16)) : 'N/A'))}</td>
    </tr>
    <tr className="text-white text-sm leading-10">
      <td><strong>Quote Count</strong></td>
      <td><strong>:</strong></td>
      <td>{user[8] && (user[8]._hex ? String(parseInt(user[8]._hex, 16)) : (user[8].hex ? String(parseInt(user[8].hex, 16)) : 'N/A'))}</td>
    </tr>
    <tr className="text-white text-sm leading-10">
      <td><strong>Contribution Count</strong></td>
      <td><strong>:</strong></td>
      <td>{user[7] && (user[7]._hex ? String(parseInt(user[7]._hex, 16)) : (user[7].hex ? String(parseInt(user[7].hex, 16)) : 'N/A'))}</td>
    </tr>
  </tbody>
</table>
</div>

</div>

    </div>
  );
}

export default Profile;
