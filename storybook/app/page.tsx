'use client';
import { useRouter } from 'next/navigation' 
// import { UserProvider } from './context/index.js'; 
export default function Home() {
  const router = useRouter();
  return (
    // <UserProvider>
    <main>
      {(
        (() => {
          router.push('/pages/Login');
          return null;
        })()
      )}
    </main>
    // </UserProvider>
  )
}
