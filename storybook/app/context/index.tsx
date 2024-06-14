'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const UserContext = createContext<{ 
  user: any; 
  updateUser: (updatedUser: any) => void; 
  connectedAcc: any; 
  checkConnectedAcc: (acc: any) => void; 
  isLogin: boolean; 
  checkLogin: (acc: boolean) => void;
} | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  
  let storedUser = {};
  let storedLogin = false;
  if (typeof window !== 'undefined') {
    try {
      const storedUserString = localStorage.getItem('user');
      const storedLoginString = localStorage.getItem('isLogin');
      storedUser = storedUserString ? JSON.parse(storedUserString) : null;
      storedLogin = storedLoginString ? JSON.parse(storedLoginString):false;
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
      storedUser = {}; 
    }
    console.log("USER:", storedUser);
  }

  const [user, setUser] = useState(storedUser);
  const [connectedAcc, setConnectedAcc] = useState(null);
  const [isLogin, setLogin] = useState(storedLogin);

  // useEffect to update localStorage whenever the user changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('isLogin', isLogin.toString());
    }
  }, [user,isLogin]);

  const updateUser = (updatedUser :any) => {
    console.log(updatedUser)
    setUser(updatedUser);
  };

  const checkConnectedAcc = (acc:any) => {
    setConnectedAcc(acc);
  };

  const checkLogin = (acc:any) => {
    setLogin(acc);
  };

  return (
    <UserContext.Provider value={{ user, updateUser, connectedAcc, checkConnectedAcc, isLogin, checkLogin }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
