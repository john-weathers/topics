import { useLocation } from 'react-router-dom';
import { SetErrMsg } from '../types';
import Register from './Register';
import Login from './Login';

const Account = ({ popup, setErrMsg }: { popup: boolean, setErrMsg: SetErrMsg }) => {
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  return (
    <div className={popup ? 'auth popup' : 'auth'}>
      <Register setErrMsg={setErrMsg}/>
      <Login from={from} setErrMsg={setErrMsg}/>
    </div>
  )
}
export default Account