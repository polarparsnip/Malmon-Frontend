import { useUserContext } from '@/context';
import styles from '@/styles/Home.module.css';
import Cookies from 'js-cookie';
import Head from 'next/head';
import Link from 'next/link';
import Router from 'next/router';
import { useState } from 'react';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const loginHandler = async (event: any) => {
  event.preventDefault();
  const username = event.target.username.value;
  const password = event.target.password.value;
  // console.log(`${baseUrl}/users/login`)
  const res = await fetch(`${baseUrl}/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: '*/*',
      'Accept-Encoding': 'gzip, deflate, br',
      Connection: 'keep-alive',
    },
    body: JSON.stringify({ username, password }),
  });

  const result = await res.json();

  if (result.user !== undefined) {
    // localStorage.setItem('token', result.token);
    Cookies.set('token', result.token, { expires: 3 });
  }

  return result;
};


export default function Login() {
  const loginContext = useUserContext();
  const [fail, setFail] = useState(false);
  // console.log('base', baseUrl)

  return (
      <>
        <Head>
          <title>Innskráning</title>
          <meta name="description" content="Generated by create next app" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta charSet="utf-8"></meta>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className={styles.main}>
          <div className={styles.loginForm}>

            <h1>Innskráning</h1>
            <form className={styles.form}
              onSubmit={async (event) => {
                event.preventDefault();
                const userInfo = await loginHandler(event);
                if (userInfo.user !== undefined) {
                  loginContext.setUserLoggedIn({ login: true, user: userInfo.user });
                  Cookies.set('user', JSON.stringify({ login: true, user: userInfo.user }), { expires: 3 });
                  // localStorage.setItem(
                  //   'user',
                  //   JSON.stringify({ login: true, user: userInfo.user })
                  // );
                  setFail(false);
                  if(userInfo.user.admin) {
                    Router.push('/admin');
                  } else {
                    Router.push('/');
                  }
                } else {
                  setFail(true);
                }
              }}
            >
              <label htmlFor='username'>Notendanafn:</label>
              <br />
              <input type='text' id='username' />
              <br />
              <label htmlFor='password'>Lykilorð:</label>
              <br />
              <input type='password' id='password' />
              <br />
              {fail ? <p>Ógilt lykilorð/password</p> : <p></p>}
              <button className={styles.soloButton} type='submit'>Innskrá</button>
            </form>

            <Link href='/register'>Nýskráning</Link>
          </div>
        </main>
      </>
  )
    
}