'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/pages/Login');
  }, [router]);

  return (
    <main>
      <p>Redirecting...</p>
    </main>
  );
}
