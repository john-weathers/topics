import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import useAuth from '../hooks/useAuth';
import useInput from '../hooks/useInput';

const Login = ({ from, setErrMsg }: { from: string, setErrMsg: Dispatch<SetStateAction<string>> }) => {
  const { setAuth } = useAuth();
  const [username, setUsername] = useState('');

  return (
    <form>
      <label htmlFor='useremail' className='text-label'>Email Address</label>
      <input
        type='text'
        id='useremail'
        autoComplete='off'
        {...usernameAttribs}
        required
        className='text-field'
      />

      <label htmlFor='password' className='text-label'>Password</label>
      <input
        type='password'
        id='password'
        onChange={(e) => setPwd(e.target.value)}
        value={pwd}
        required
        className='text-field'
      />
      
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