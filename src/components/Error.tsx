import { Dispatch, SetStateAction, RefObject } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'

type ErrorProps = {
  errRef: RefObject<HTMLInputElement>,
  errMsg: string,
  setErrMsg: Dispatch<SetStateAction<string>>,
}

const Error = ({ errRef, errMsg, setErrMsg }: ErrorProps) => {
  return (
    <div className={errMsg ? 'errmsg' : 'offscreen'}>
      <FontAwesomeIcon onClick={() => setErrMsg('')} icon={faCircleXmark} aria-label='close error message' className='x-close' size='xl' />
      <p ref={errRef} aria-live='assertive' className='errmsg-p'>{errMsg}</p>
    </div> 
  )
}
export default Error