import { useEffect, RefObject } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import { SetErrMsg } from '../types';
import Account from './Account';

type ErrorProps = {
  errRef: RefObject<HTMLInputElement>,
  errMsg: string | string[],
  setErrMsg: SetErrMsg,
}

const Error = ({ errRef, errMsg, setErrMsg }: ErrorProps) => {
  useEffect(() => {
    if (errMsg && errRef?.current) {
      errRef.current.focus();
    }
  }, [errMsg])


  return (
    <div className={errMsg ? 'errmsg' : 'offscreen'}>
      <FontAwesomeIcon onClick={() => setErrMsg('')} icon={faCircleXmark} aria-label='close error message' className='x-close' size='xl' />
      <p ref={errRef} aria-live='assertive' className='errmsg-p'>{errMsg?.[1] || errMsg}</p>
      {errMsg[0] === 'auth required' && (
        <Account popup={true} setErrMsg={setErrMsg} />
      )}
    </div> 
  )
}
export default Error