import { Button } from '@/components/Button/Button'
import Captcha from '@/components/Captcha/Captcha'
// eslint-disable-next-line import/no-unresolved
import SentenceCard from '@/components/SentenceCard/SentenceCard'
import { useUserContext } from '@/context'
import styles from '@/styles/Home.module.css'
import { Sentence } from '@/types'
import Cookies from 'js-cookie'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

/**
 * Sendir inn einfaldaða setningu frá notanda
 */
const submitSentenceHandler = async (
  event: any, 
  token: any, 
  sentenceId: number, 
  userId: number
): Promise<Sentence> => {
  event.preventDefault();

  // const formData = new FormData();
  // formData.append('simplifiedSentence', event.target.simplifiedSentence.value);
  // formData.append('sentenceId', String(sentenceId));
  // formData.append('userId', String(userId));
  let res;
  try {
    res = await fetch(`${baseUrl}/users/sentences/simplified`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ 
        'simplifiedSentence': event.target.simplifiedSentence.value, 
        'sentenceId': sentenceId 
      }),
    });
  } catch(e: any) {
    console.error('Error:', e.message)
    throw new Error(e.message || 'Unknown error');
  }

  if (res && !res.ok) {
    console.error('Error:', res.status, res.statusText);
    const message = await res.json();
    console.error(message)
    throw new Error(message || 'Unknown error');
  }

  let updateRes;
  try {
    updateRes = await fetch(`${baseUrl}/users/sentences/${sentenceId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  } catch(e: any) {
    console.error('Error:', e.message)
    throw new Error(e.message || 'Unknown error');
  }

  if (updateRes && !updateRes.ok) {
    console.error('Error:', updateRes.status, updateRes.statusText);
    const message = await updateRes.json();
    console.error(message)
    throw new Error(message || 'Unknown error');
  }

  let updateUser;
  try {
    updateUser = await fetch(`${baseUrl}/users/${userId}`, {
      method: 'PATCH',
      headers: {
      'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ 
        'completedSentences': '1'
      }),
    });
  } catch(e: any) {
    console.error('Error:', e.message)
    throw new Error(e.message || 'Unknown error');
  }

  if (updateUser && !updateUser.ok) {
    console.error('Error:', updateUser.status, updateUser.statusText);
    const message = await updateUser.json();
    console.error(message)
    throw new Error(message || 'Unknown error');
  }

  const result = await res.json();

  return result;
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  let res;

  try {
    res = await fetch(`${baseUrl}/users/sentences/sentence`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${context.req.cookies.token}`,
      },
    });
  } catch(e: any) {
    console.error('Error:', e.message)
    return {
      props: { errorMessage: e.message || 'unknown error'},
    };
  }

  if (res && !res.ok) {
    console.error('Error:', res.status, res.statusText);
    const message = await res.json();
    console.error(message)

    return {
      props: { errorMessage: message.error || 'unknown error'},
    };
  }

  const sentence = await res.json();

  if (!sentence) {
    return {
      props: {},
    };
  }
  
  return {
    props: { sentence },
  }
}

export default function SimplifyPage( 
  { sentence, errorMessage }: 
  { sentence: Sentence, errorMessage: any } 
) {
  const router = useRouter();
  const [token, setToken] = useState('');
  const loginContext = useUserContext();
  const [error, setError] = useState(null);

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

  if(errorMessage && errorMessage !== error) {
    setError(errorMessage);
  }

  if (!sentence) {
    return (
      <>
        <Head>
          <title>Einfalda Setningar</title>
          <meta name="description" content="Setningarsöfnun" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta charSet="utf-8"></meta>
          <link rel="icon" href="/mlogo.png" />
        </Head>
        <main className={styles.main}>
          <div className={styles.notFound}>
          {error ? <h1>{error}</h1> : <h1>Ekki tókst að sækja gögn</h1>}
          </div>
        </main>
      </>
    )
  }

  if (!sentence.sentence) {
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
        <title>Einfalda setningar</title>
        <meta name="description" content="Setningarsöfnun" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8"></meta>
        <link rel="icon" href="/mlogo.png" />
      </Head>
      <main className={styles.main}>
        <div className={styles.grid} >
          <div className={styles.cards} >
            <SentenceCard value={sentence.sentence} />
            <Captcha>
              <div className={styles.submitSentenceForm}>
                <form className={styles.form}
                  onSubmit={async (event) => {
                    event.preventDefault();
                    try {
                      await submitSentenceHandler(
                        event, 
                        token, 
                        sentence.id, 
                        loginContext.userLoggedIn.user.id
                    );
                    router.reload();
                    } catch(e: any) {
                      setError(e.message);
                    }
                  }}
                >
                  {error && <p>{error}</p>}
                  <label htmlFor='simplifiedSentence'>Einfalda:</label>
                  <input type='text' id='simplifiedSentence' placeholder="Einfalda setningu" required/>
                  <Button type='submit'>Senda inn</Button>
                </form>
              </div>
            </Captcha>
          </div>
        </div> 
      </main>
    </>
  )
}
