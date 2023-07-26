import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

const USERNAME_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿ0-9]{3,20}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = '/users/register';

const Register = ({ setErrMsg }: { setErrMsg: Dispatch<SetStateAction<string>> }) => {
  const [username, setUsername] = useState('');
  const [validUsername, setValidUsername] = useState(false);
  const [usernameFocus, setUsernameFocus] = useState(false);

  const [pwd, setPwd] = useState('');
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState('');
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  return (
    <form className='register'>
      <label htmlFor='username' className='text-label'>
        Username
      </label>
      <input
        type='text'
        id='username'
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
        <p id='uidnote' className={usernameFocus && username && !validUsername ? 'instructions' : 'offscreen'}>
          <FontAwesomeIcon icon={faInfoCircle} />
          Enter a valid username: English alphabet, most accented letters, and numbers allowed.<br />
          3-20 characters total.
        </p>


      <label htmlFor='password' className='text-label'>
        Password
      </label>
      <input
        type='password'
        id='password'
        onChange={(e) => setPwd(e.target.value)}
        value={pwd}
        required
        aria-invalid={validPwd ? 'false' : 'true'}
        aria-describedby='pwdnote'
        onFocus={() => setPwdFocus(true)}
        onBlur={() => setPwdFocus(false)}
        className={!pwd ? 'text-field' : pwd && !validPwd ? 'text-field invalid' : 'text-field valid'}
      />
      <p id='pwdnote' className={pwdFocus && !validPwd ? 'instructions' : 'offscreen'}>
        <FontAwesomeIcon icon={faInfoCircle} />{' '}
        8 to 24 characters.<br />
        Must include uppercase and lowercase letters, a number and a special character.<br />
        Allowed special characters: <span aria-label='exclamation mark'>!</span> <span aria-label='at symbol'>@</span> 
        <span aria-label='hashtag'>#</span> <span aria-label='dollar sign'>$</span> <span aria-label='percent'>%</span>
      </p>

      <input
        type='password'
        id='confirm_pwd'
        onChange={(e) => setMatchPwd(e.target.value)}
        value={matchPwd}
        required
        aria-invalid={validMatch ? 'false' : 'true'}
        aria-describedby='confirmnote'
        onFocus={() => setMatchFocus(true)}
        onBlur={() => setMatchFocus(false)}
        className={!matchPwd ? 'text-field' : matchPwd && !validMatch ? 'text-field invalid' : 'text-field valid'}
      />
      <p id='confirmnote' className={matchFocus && !validMatch ? 'instructions' : 'offscreen'}>
        <FontAwesomeIcon icon={faInfoCircle} />{' '}
        Must match the first password input field.
      </p>
      <button></button>
    </form>
  )
}
export default Register