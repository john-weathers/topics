import { useState, FormEvent, FormEventHandler } from 'react';
import { Navigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { SetErrMsg } from '../types';
import useAuth from '../hooks/useAuth';
import useInput from '../hooks/useInput';
import useToggle from '../hooks/useToggle';
import axios from 'axios';
import axiosInstance from '../api/axios';

const LOGIN_URL = '/users/login';

const Login = ({ from, setErrMsg }: { from: string, setErrMsg: SetErrMsg }) => {
  const { auth, setAuth } = useAuth();
  const [username, resetUsername, usernameAttribs] = useInput('username', '');
  const [pwd, setPwd] = useState('');
  const [check, toggleCheck] = useToggle('persist', false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
        const response = await axiosInstance.post(LOGIN_URL,
          { username, pwd },
          {
            withCredentials: true,
          },
        );
        const { accessToken, username: name, rating } = response?.data;
        
        setAuth({ username: name, accessToken, rating });
        setLoading(true);
    } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 400) {
            setErrMsg('Missing Username or Password');
          } else if (err.response?.status === 401) {
            setErrMsg('Unauthorized');
          } else {
            setErrMsg('Login Failed');
          }
        } else {
          setErrMsg('No server response')
        }
    }
}

  if (auth?.accessToken) return <Navigate to={from} replace={true} />

  if (loading) return (
    <div className='loading'>
      <FontAwesomeIcon icon={faSpinner} spin size='3x'/>
    </div>
  )


  return (
    <form onSubmit={handleSubmit} className='login'>
      <label className='text-label'>
        Username
        <input
          type='text'
          autoComplete='off'
          {...usernameAttribs}
          required
          className='text-field'
        />
      </label>

      <label className='text-label'>
        Password
        <input
          type='password'
          onChange={(e) => setPwd(e.target.value)}
          value={pwd}
          required
          className='text-field'
        />
      </label>
      
      <label htmlFor='persist' className='persist-label'>
        <input
          type='checkbox'
          id='persist'
          onChange={toggleCheck}
          checked={check}
        />
        Keep me signed in
      </label>
      <button className='btn'>Login</button>
    </form>
  )
}
export default Login