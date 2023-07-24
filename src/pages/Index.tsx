import { useState, FormEvent } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Post } from './Layout';
import useAuth from '../hooks/useAuth';

const Index = () => {
  const { auth } = useAuth();
  const feed: Post[] = useOutletContext();
  const [username, setUsername] = useState(auth?.accessToken ? auth?.username : 'Super anonymous user');

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

  }

  return (
    <div>

    </div>
  )
}
export default Index