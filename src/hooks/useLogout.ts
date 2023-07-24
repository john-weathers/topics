import axios from "../api/axios";
import useAuth from "./useAuth";

const useLogout = () => {
  const { setAuth } = useAuth();
  const logoutURL = '/users/logout';

  const logout = async () => {
    setAuth({});
    try { 
      await axios.get(logoutURL, {
        withCredentials: true
      });
    } catch (err) {
      console.error(err);
    }
  }

  return logout;
}

export default useLogout;