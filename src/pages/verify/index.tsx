import { Button } from '@/components/Button/Button'
import Captcha from '@/components/Captcha/Captcha'
import SentenceCard from '@/components/SentenceCard/SentenceCard'
import { useUserContext } from '@/context'
import styles from '@/styles/Home.module.css'
import { SimplifiedSentence } from '@/types'
import Cookies from 'js-cookie'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const submitVerificationHandler = async (token: any, simplifiedSentenceId: number, userId: number) => {

  const res = await fetch(`${baseUrl}/users/sentences/simplified/${simplifiedSentenceId}/verify`, {
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

const submitRejectionHandler = async (token: any, simplifiedSentenceId: number) => {

  const res = await fetch(`${baseUrl}/users/sentences/simplified/${simplifiedSentenceId}/reject`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    console.error('Error:', res.status, res.statusText);
    return res;
  }

  const result = await res.json();

  return result;
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  let res;
  try {
    res = await fetch(`${baseUrl}/users/sentences/simplified/sentence`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${context.req.cookies.token}`,
      },
    });
  } catch(e) {
    console.error('error', e);
  }

  let simplifiedSentence;
    
  try {
    simplifiedSentence = await res?.json();
  } catch(e) {
    console.error('error', e);
  }

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

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prevProgress => prevProgress + 19);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const checkLogin = async () => {
      const {user} = loginContext.userLoggedIn;

      if(user !== undefined){
        const cookieToken = Cookies.get('token');
        if(cookieToken) setToken(cookieToken);
      }
    }
    checkLogin();
  }, [loginContext, router])

  if (!simplifiedSentence) {
    return (
      <>
        <Head>
          <title>Staðfesta Setningar</title>
          <meta name="description" content="Setningarsöfnun" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta charSet="utf-8"></meta>
          <link rel="icon" href="/mlogo.png" />
        </Head>
        <main className={styles.main}>
          <div className={styles.notFound}>
            <h1>Ekki tókst að sækja gögn</h1>
          </div>
        </main>
      </>
    )
  }

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
        <title>Staðfesta Setningar</title>
        <meta name="description" content="Setningarsöfnun" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8"></meta>
        <link rel="icon" href="/mlogo.png" />
      </Head>
      <main className={styles.main}>

          <>
            <div className={styles.verify} >
              <h2>Upprunaleg setning:</h2>
              <SentenceCard value={simplifiedSentence.originalsentence} />
   
              <h2>Einfölduð setning:</h2>
              <SentenceCard value={simplifiedSentence.simplifiedsentence} />
  
              <Captcha>

                <div className={styles.submitVerification}>
                {progress < 100 ? (
                  <div className={styles.progressBarContainer}>
                    <div className={styles.progressBar} style={{ width: `${progress}%` }} />
                  </div>
                ) : (
                  <div className={styles.verifyButton}>
                    <Button onClick={async () => {
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
                    }}>Staðfesta setningu</Button>

                    <Button onClick={async () => {
                          const submittedRejection = await submitRejectionHandler(
                            token, 
                            simplifiedSentence.id
                          );
                          if (submittedRejection !== undefined) {
                            router.reload();
                          } else {
                            console.error( {error: submittedRejection })
                          }
                    }}>Hafna setningu</Button>
                  </div>
                  )}

                </div>

              </Captcha>

            </div>    
          </>

      </main>
    </>
  )
}
