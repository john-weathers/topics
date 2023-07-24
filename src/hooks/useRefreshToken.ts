import axios from '../api/axios';
import useAuth from './useAuth';

const useRefreshToken = () => {
    const { setAuth } = useAuth();
    const refreshURL = '/users/refresh';

    const refresh = async () => {
        const response = await axios.get(refreshURL, {
            withCredentials: true
        });
        setAuth(prev => {
            return {
                ...prev, 
                accessToken: response.data.accessToken,
                username: response.data.username,
                rating: response.data.rating, 
            }
        });
        return response.data.accessToken;
        
    }
    return refresh;
};

export default useRefreshToken;