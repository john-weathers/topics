import { ReactNode, createContext, useState, Dispatch, SetStateAction } from "react";

type AuthProviderProps = {
  children: ReactNode,
}

type Auth = {
  auth: {
    accessToken?: string,
    username?: string,
    rating?: number,
  }
  setAuth: Dispatch<SetStateAction<{ accessToken?: string }>>
}

const AuthContext = createContext<Auth>({
  auth: {},
  setAuth: () => {}
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [auth, setAuth] = useState({});

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;