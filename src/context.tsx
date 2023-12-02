import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { createContext, useContext, useEffect, useState } from 'react';

interface IUserContext {
    userLoggedIn: { login: boolean; user: { id: number, username: string, admin: boolean } };
    setUserLoggedIn: React.Dispatch<React.SetStateAction<{ login: boolean; user: { id: number, username: string, admin: boolean } }>>;
    logOut: () => void;
    checkToken: () => void;
}
  
export const UserContext = createContext<IUserContext>({
    userLoggedIn: { login: false, user: { id: -1, username: '', admin: false } },
    setUserLoggedIn: () => {},
    logOut: () => {},
    checkToken: () => {},
})


export function AppWrapper({ children }: { children: React.ReactNode }) {
    // const name = 'test';
    const [userLoggedIn, setUserLoggedIn] = useState({
        login: false,
        user: { id: -1, username: '', admin: false },
    });

    // const [login, setLogin] = useState({});

    const logOut = () => {
    setUserLoggedIn({ login: false, user: { id: -1, username: '', admin: false }});
    // localStorage.setItem("user", JSON.stringify({ login: false, user: {}}));
    // localStorage.clear();

    Cookies.remove('token');
    Cookies.remove('user');
    }

    useEffect(() => {   
        // const storedUser = localStorage.getItem('user');
        const storedUser = Cookies.get('user');

        console.log(storedUser)

        if (storedUser) {
          setUserLoggedIn(JSON.parse(storedUser));
        }
    }, []);

    // useEffect(() => {
    //     const checkToken = async () => {
    //       const token = localStorage.getItem('token');
    //       if (token) {
    //         const decodedToken: any = jwt_decode(token);
    //         const expirationTime = decodedToken.exp; // expiration time in milliseconds
    //         const currentTime = Date.now() / 1000;
    //         if (currentTime > expirationTime) {
    //           logOut(); // token expired, log out the user
    //         }
    //       }
    //     };
    //     checkToken();
    //     const intervalId = setInterval(checkToken, 60*1000);
    //     return () => clearInterval(intervalId);
    // }, [userLoggedIn]);

    const checkToken = async () => {
        // const token = localStorage.getItem('token');
        const token = Cookies.get('token');
        if (token) {
          const decodedToken: any = jwtDecode(token);
          const expirationTime = decodedToken.exp; // expiration time in milliseconds
          const currentTime = Date.now() / 1000;
          // console.log(expirationTime - currentTime)
          if (currentTime > expirationTime) {
            logOut(); // token expired, log out the user
          }
        }
    };

    useEffect(() => {
      checkToken();
    });

    return (
        <UserContext.Provider value={{ checkToken, logOut, userLoggedIn, setUserLoggedIn }}>
        { children }
        </UserContext.Provider>
    );
}

export function useUserContext() {
  return useContext(UserContext);
}