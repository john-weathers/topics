import { useState, useEffect, FormEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { SetErrMsg } from '../types';
import axios from 'axios';
import axiosInstance from '../api/axios';

const USERNAME_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿ0-9]{3,20}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = '/users/register';

const Register = ({ setErrMsg }: { setErrMsg: SetErrMsg }) => {
  const [username, setUsername] = useState('');
  const [validUsername, setValidUsername] = useState(false);
  const [usernameFocus, setUsernameFocus] = useState(false);

  const [pwd, setPwd] = useState('');
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState('');
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setValidUsername(USERNAME_REGEX.test(username));
  }, [username]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const v1 = USERNAME_REGEX.test(username);
    const v2 = PWD_REGEX.test(pwd);

    if (!v1 || !v2) {
      setErrMsg('Invalid Entry');
      return;
    }

    try {
      const response = await axiosInstance.post(REGISTER_URL,
        {
          username,
          pwd,
        },
        {
          withCredentials: true,
        },
      );

      setSuccess(true);
      setUsername('');
      setPwd('');
      setMatchPwd('');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 409) {
          setErrMsg('Username Taken');
        } else if (err.response?.status === 400) {
          setErrMsg('Complete all fields as instructed');
        } else {
          setErrMsg('Registration Failed');
        }
      } else {
        setErrMsg('No Server Response');
      }
    }
  }

  if (success) return (
    <div>
      <h1>Success!</h1>
      <p>You can now sign in.</p>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className='register'>
      <label className='text-label'>
        Username
        <input
          type='text'
          autoComplete='off'
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          required
          aria-invalid={validUsername ? 'false' : 'true'}
          aria-describedby='uidnote'
          onFocus={() => setUsernameFocus(true)}
          onBlur={() => setUsernameFocus(false)}
          className={!username ? 'text-field' : username && !validUsername ? 'text-field invalid' : 'text-field valid'}
        />
      </label>
      <p id='uidnote' className={usernameFocus && username && !validUsername ? 'instructions' : 'offscreen'}>
        <FontAwesomeIcon icon={faInfoCircle} />
        Enter a valid username: English alphabet, most accented letters, and numbers allowed.<br />
        3-20 characters total.
      </p>


      <label className='text-label'>
        Password
        <input
          type='password'
          onChange={(e) => setPwd(e.target.value)}
          value={pwd}
          required
          aria-invalid={validPwd ? 'false' : 'true'}
          aria-describedby='pwdnote'
          onFocus={() => setPwdFocus(true)}
          onBlur={() => setPwdFocus(false)}
          className={!pwd ? 'text-field' : pwd && !validPwd ? 'text-field invalid' : 'text-field valid'}
        />
      </label>
      <p id='pwdnote' className={pwdFocus && !validPwd ? 'instructions' : 'offscreen'}>
        <FontAwesomeIcon icon={faInfoCircle} />{' '}
        8 to 24 characters.<br />
        Must include uppercase and lowercase letters, a number and a special character.<br />
        Allowed special characters: <span aria-label='exclamation mark'>!</span> <span aria-label='at symbol'>@</span> 
        <span aria-label='hashtag'>#</span> <span aria-label='dollar sign'>$</span> <span aria-label='percent'>%</span>
      </p>

      <label className='text-label'>
        Confirm Password
        <input
          type='password'
          onChange={(e) => setMatchPwd(e.target.value)}
          value={matchPwd}
          required
          aria-invalid={validMatch ? 'false' : 'true'}
          aria-describedby='confirmnote'
          onFocus={() => setMatchFocus(true)}
          onBlur={() => setMatchFocus(false)}
          className={!matchPwd ? 'text-field' : matchPwd && !validMatch ? 'text-field invalid' : 'text-field valid'}
        />
      </label>
      <p id='confirmnote' className={matchFocus && !validMatch ? 'instructions' : 'offscreen'}>
        <FontAwesomeIcon icon={faInfoCircle} />{' '}
        Must match the first password input field.
      </p>
      <button disabled={!validUsername || !validPwd ? true : false} className='btn'>Sign Up</button>
    </form>
  )
}
export default Register