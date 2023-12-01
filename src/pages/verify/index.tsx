import { useUserContext } from '@/context'
import styles from '@/styles/Home.module.css'
import { SimplifiedSentence } from '@/types'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const submitVerificationHandler = async (token: any, simplifiedSentenceId: number, userId: number) => {

  const res = await fetch(`${baseUrl}/sentences/simplified/${simplifiedSentenceId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    console.error('Error:', res.status, res.statusText);
    return res;
  }

  const updateUser = await fetch(`${baseUrl}/users/${userId}`, {
    method: 'PATCH',
    headers: {
     'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ 
      'completedVerifications': '1'
    }),
  });

  if (!updateUser.ok) {
    console.error('Error:', updateUser.status, updateUser.statusText);
    return updateUser;
  }

  const result = await res.json();

  return result;
};

export const getServerSideProps: GetServerSideProps = async () => {

  const reqq = await fetch(`${baseUrl}/sentences/simplified/sentence`);
  const simplifiedSentence = await reqq.json();

  if (!simplifiedSentence) {
    return {
      props: {},
    };
  }
  
  return {
    props: { simplifiedSentence },
  }
}

export default function VerifyPage( { simplifiedSentence }: { simplifiedSentence: SimplifiedSentence } ) {
  const router = useRouter();
  const [token, setToken] = useState('');
  const loginContext = useUserContext();

  useEffect(() => {
    const checkLogin = async () => {
      const {user} = loginContext.userLoggedIn;

      if(user !== undefined){
        const localToken = localStorage.getItem('token');
        if(localToken) setToken(localToken);
      }
    }
    checkLogin();
  }, [loginContext, router])

  if (!simplifiedSentence.simplifiedsentence) {
    return (
      <main className={styles.main}>
        {loginContext.userLoggedIn.login ? (
            <div className={styles.notFound}>
              <h1>Engin gögn fundust.</h1>
            </div>
          ) : (
            <div className={styles.notFound}>
              <h1>Síða fannst ekki</h1>
            </div>
          )
        }
      </main> 
    )
  }

  return (
    <>
      <Head>
        <title>Staðfesta setningar</title>
        <meta name="description" content="Setningarsöfnun" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8"></meta>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        {loginContext.userLoggedIn.login ? (
          <>
            <div className={styles.cards} >
              <h2>Upprunaleg setning:</h2>
              <h3>{simplifiedSentence.originalsentence}</h3>
              <br/>
              <h2>Einfölduð setning:</h2>
              <h3>{simplifiedSentence.simplifiedsentence}</h3>

              <br/>

              <div className={styles.submitVerification}>

                <button className={styles.soloButton} onClick={async () => {
                      const submittedVerification = await submitVerificationHandler(
                        token, 
                        simplifiedSentence.id, 
                        loginContext.userLoggedIn.user.id
                      );
                      if (submittedVerification !== undefined) {
                        router.reload();
                      } else {
                        console.error( {error: submittedVerification })
                      }
                }}>Staðfesta setningu</button>

              </div>

            </div>    
          </>
        ) : (
          <div className={styles.notFound}>
            <h1>Síða fannst ekki</h1>
          </div>
        )}
      </main>
    </>
  )
}
