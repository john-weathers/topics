import { useState, FormEvent, useRef, Dispatch, SetStateAction } from 'react';
import { useOutletContext } from 'react-router-dom';
import { PostProps } from '../types';
import useAuth from '../hooks/useAuth';
import Account from '../components/Account';

const Index = () => {
  const { auth, setAuth } = useAuth();
  const { feed, windowWidth, setErrMsg }: { feed: PostProps[], windowWidth: number, setErrMsg: Dispatch<SetStateAction<string>> }  = useOutletContext();

  return (
    <div className='index'>
      {!auth?.accessToken && (
        <Account />
      )}
      <div className='feed'>

      </div>
    </div>
  )
}
export default Index