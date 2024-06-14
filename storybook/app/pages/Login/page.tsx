'use client';
import { useEffect } from 'react';
import Login from '../../components/Login'
import { useUser } from 'C:/Users/laksh/Downloads/StoryBook_App/storybook/app/context';
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
