import { Button } from '@/components/Button/Button'
import Paging from '@/components/paging/Paging'
import SentenceCard from '@/components/SentenceCard/SentenceCard'
import { useUserContext } from '@/context'
import styles from '@/styles/Home.module.css'
import { Query, Sentence, Sentences } from '@/types'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const adminRegisterSentenceHandler = async (event: any, token: any) => {
  event.preventDefault();

  const formData = new FormData();
  formData.append('sentence', event.target.sentence.value);

  const res = await fetch(`${baseUrl}/admin/sentences`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const result = await res.json();

  return result;
};

const adminPatchSentenceHandler = async (event: any, token: any, sentenceId: number) => {
  event.preventDefault();
  const sentence = event.target.sentence.value;

  const formData = new FormData();

  if (event.target.name.value.trim().length > 0) {
    formData.append('sentence', sentence);
  }

  const res = await fetch(`${baseUrl}/admin/events/${sentenceId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const result = await res.json();

  return result;
};

const adminDeleteSentenceHandler = async (token: any, sentenceId: number) => {
  
  const res = await fetch(`${baseUrl}/admin/sentences/${sentenceId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: '*/*',
      'Accept-Encoding': 'gzip, deflate, br',
      Connection: 'keep-alive',
    },
    body: JSON.stringify({}),
  });

  const result = await res.json();

  return result;
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { query } = context;

  let off = '';
  if(query.offset) {
    off = `offset=${query.offset}`;
  }
  let lim = '';
  if(query.limit) {
    lim = `limit=${query.limit}`;
  }
  
  const req = await fetch(`${baseUrl}/sentences/?${off}&${lim}`);
  const sentences = await req.json();

  if (!sentences) {
    return {
      props: {},
    };
  }

  return {
    props: { query, sentences },
  }
}

export default function SentencesPage(
  { query, sentences }: { query: Query, sentences: Sentences }
) {
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

  if (!sentences) {
    return <h1>Engin gögn fundust.</h1>;
  }

  return (
    <>
      <Head>
        <title>Setningar</title>
        <meta name="description" content="Setningarsöfnun" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8"></meta>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        {loginContext.userLoggedIn.login && loginContext.userLoggedIn.user.admin ? (
          <>
            <div className={styles.cards}>
          
              {sentences.sentences.map((value: Sentence) => (
                  <div className={styles.card} key={value.id} >

                    <SentenceCard value={value} ></SentenceCard>

                    {loginContext.userLoggedIn.login && loginContext.userLoggedIn.user.admin ? (
                      <div className={styles.patchForm}>

                        <form className={styles.form}
                            onSubmit={async (event) => {
                            event.preventDefault();
                            const patchSentence = await adminPatchSentenceHandler(event, token, value.id);
                            if (!patchSentence.error) {
                              router.reload();
                            } else {
                              console.error( {error: patchSentence })
                            }
                          }}
                        >
                          <label htmlFor='patchSentence'></label>
                          <br />
                          <input type='text' id='patchSentence' />
                          <br />
                          <Button type='submit'>Uppfæra Setningu</Button>
                        </form>
                      </div>
                    ) : null}

                    <br/>

                    {loginContext.userLoggedIn.login && loginContext.userLoggedIn.user.admin ? (
                      <div><Button className={styles.soloButton} onClick={async () => {
                        const deletedSentence = await adminDeleteSentenceHandler(token, value.id);
                        if (deletedSentence !== undefined) {
                          router.reload();
                        } else {
                          console.error( {error: deletedSentence})
                        }
                      }}>Eyða Setningu</Button></div>) : null
                    }

                  </div>
                ))}
            
            </div>

            {!(sentences.sentences.length < 10 && (query.offset === 0 || query.offset === undefined)) ? (
              <div className='paging'>
                <Paging paging={sentences} query={query} page={'sentences'}></Paging>
              </div>
            ) : null}

            {loginContext.userLoggedIn.login && loginContext.userLoggedIn.user.admin ? (
              <div className={styles.postForm}>
                <h1>Bæta við setningu</h1>
                <form className={styles.form}
                  onSubmit={async (event) => {
                    event.preventDefault();
                    const registerSentence = await adminRegisterSentenceHandler(event, token);
                    if (registerSentence.name !== undefined) {
                      router.reload();
                    }
                  }}
                >
                  <label htmlFor='sentence'>Setning:</label>
                  <br />
                  <input type='text' id='sentence' />
                  <br />
                  <Button type='submit'>Skrá setningu</Button>
                </form>
              </div>
            ) : null }
          </>) : (<h1>Síða fannst ekki</h1>)
        }
      </main>
    </>
  )
}
