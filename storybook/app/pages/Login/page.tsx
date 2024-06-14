'use client';
import { useEffect } from 'react';
import Login from '../../components/Login'
import { useUser } from '../../context';
import { useRouter } from 'next/navigation'
export default function LoginPage() {
  const { isLogin} = useUser();
  const router = useRouter();
  useEffect(() => {
    if (isLogin) {
      router.push('/pages/Home');
    }
  }, [isLogin]);

  return <>{isLogin === false ? <Login /> : null}</>;
}
