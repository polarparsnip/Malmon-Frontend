import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useState } from 'react';

interface IUserContext {
    userLoggedIn: { login: boolean; user: { id: number, username: string, admin: boolean } };
    setUserLoggedIn: React.Dispatch<React.SetStateAction<{ login: boolean; 
      user: { id: number, username: string, admin: boolean } }>>;
    logOut: () => void;
}
  
export const UserContext = createContext<IUserContext>({
    userLoggedIn: { login: false, user: { id: -1, username: '', admin: false } },
    setUserLoggedIn: () => {},
    logOut: () => {},
})


export function AppWrapper({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    const [userLoggedIn, setUserLoggedIn] = useState({
        login: false,
        user: { id: -1, username: '', admin: false },
    });

    // const [login, setLogin] = useState({});

    const logOut = () => {
      setUserLoggedIn({ login: false, user: { id: -1, username: '', admin: false }});
      Cookies.remove('token');
      Cookies.remove('user');
      router.push('/')
    }

    useEffect(() => {   
        const storedUser = Cookies.get('user');

        if (storedUser) {
          setUserLoggedIn(JSON.parse(storedUser));
        }
    }, []);

    return (
        <UserContext.Provider value={{ logOut, userLoggedIn, setUserLoggedIn }}>
        { children }
        </UserContext.Provider>
    );
}

export function useUserContext() {
  return useContext(UserContext);
}