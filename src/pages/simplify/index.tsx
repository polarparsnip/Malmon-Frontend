import { Button } from '@/components/Button/Button'
import { useUserContext } from '@/context'
import styles from '@/styles/Home.module.css'
import { Sentence } from '@/types'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const submitSentenceHandler = async (event: any, token: any, sentenceId: number, userId: number) => {
  event.preventDefault();

  // const formData = new FormData();
  // formData.append('simplifiedSentence', event.target.simplifiedSentence.value);
  // formData.append('sentenceId', String(sentenceId));
  // formData.append('userId', String(userId));

  const res = await fetch(`${baseUrl}/sentences/simplified`, {
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

  if (!res.ok) {
    console.error('Error:', res.status, res.statusText);
    return res;
  }

  const updateRes = await fetch(`${baseUrl}/sentences/${userId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!updateRes.ok) {
    console.error('Error:', updateRes.status, updateRes.statusText);
    return updateRes;
  }

  const updateUser = await fetch(`${baseUrl}/users/${userId}`, {
    method: 'PATCH',
    headers: {
     'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ 
      'completedSentences': '1'
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

  const req = await fetch(`${baseUrl}/sentences/sentence`);
  const sentence = await req.json();

  if (!sentence) {
    return {
      props: {},
    };
  }
  
  return {
    props: { sentence },
  }
}

export default function SimplifyPage( { sentence }: { sentence: Sentence } ) {
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
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        {loginContext.userLoggedIn.login ? (
          <>
            <div className={styles.cards} >

              <h3>{sentence.sentence}</h3>

              <br/>

              <div className={styles.submitSentenceForm}>
                <p>Einfölduð setning:</p>

                <form className={styles.form}
                  onSubmit={async (event) => {
                    event.preventDefault();

                    const submittedSentence = await submitSentenceHandler(
                      event, 
                      token, 
                      sentence.id, 
                      loginContext.userLoggedIn.user.id
                    );

                    if (!submittedSentence.error) {
                      router.reload();
                    } else {
                      console.error( {error: submittedSentence })
                    }
                  }}
                >
                  <label htmlFor='simplifiedSentence'></label>
                  <br />
                  <input type='text' id='simplifiedSentence' />
                  <br />
                  <Button type='submit'>Senda inn</Button>
                </form>
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
