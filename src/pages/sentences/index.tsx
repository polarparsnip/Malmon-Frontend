import { Button } from '@/components/Button/Button'
// eslint-disable-next-line import/no-unresolved
import SentenceCard from '@/components/SentenceCard/SentenceCard'
import Paging from '@/components/paging/Paging'
import { useUserContext } from '@/context'
import styles from '@/styles/Home.module.css'
import { Query, Sentence, Sentences } from '@/types'
import Cookies from 'js-cookie'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

/**
 * Frá admin, Skráir og sendir inn nýja setningu
 */
const adminRegisterSentenceHandler = async (event: any, token: any): Promise<Sentence> => {
  event.preventDefault();

  const sentenceData = { 'sentence': event.target.sentence.value };

  let res;
  try {
    res = await fetch(`${baseUrl}/admin/sentences`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(sentenceData),
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

  const result = await res.json();

  return result;
};

/**
 * Frá admin, Breytir setningu sem er núþegar til
 */
const adminPatchSentenceHandler = async (
  event: any, token: any, sentenceId: number
): Promise<Sentence> => {
  event.preventDefault();

  const sentence = event.target.patchSentence.value;
  const sentenceData = { 'sentence': sentence };
  
  let res;
  try {
    res = await fetch(`${baseUrl}/admin/sentences/${sentenceId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(sentenceData),
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

  const result = await res.json();

  return result;
};

/**
 * Frá admin, Eyðir setningu
 */
const adminDeleteSentenceHandler = async (token: any, sentenceId: number): Promise<object> => {

  let res;
  try {
    res = await fetch(`${baseUrl}/admin/sentences/${sentenceId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
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

  let res;
  try {
    res = await fetch(`${baseUrl}/admin/sentences/?${off}&${lim}`, {
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

  const sentences = await res.json();

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
  { query, sentences, errorMessage }: { query: Query, sentences: Sentences, errorMessage: any }
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

  if (!sentences) {
    return (
      <>
        <Head>
          <title>Setningar</title>
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

  if (!sentences.sentences || sentences.sentences.length === 0) {
    return (
      <main className={styles.main}>
        {loginContext.userLoggedIn.login && loginContext.userLoggedIn.user.admin ? (
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
        <title>Setningar</title>
        <meta name="description" content="Setningarsöfnun" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8"></meta>
        <link rel="icon" href="/mlogo.png" />
      </Head>
      <main className={styles.main}>

        <div className={styles.grid}>
          <div className={styles.cards}>
            
            <div className={styles.adminSentences}>
                {sentences.sentences.map((value: Sentence) => (
                  <div className={styles.card} key={value.id} >

                    <SentenceCard value={value.sentence} ></SentenceCard>

                    {loginContext.userLoggedIn.login && loginContext.userLoggedIn.user.admin ? (
                      <div className={styles.patchForm}>
                        {value.simplified ? (<p>Hefur verið einfölduð</p>
                        ) : (<p>Hefur ekki verið einfölduð</p>)}


                        <form className={styles.form}
                            onSubmit={async (event) => {
                            event.preventDefault();
                            try {
                              await adminPatchSentenceHandler(event, token, value.id);
                              router.reload();
                            } catch(e: any) {
                              setError(e.message);
                            }
                          }}
                        >
                          <label htmlFor='patchSentence'></label>
                          <input type='text' id='patchSentence' placeholder="Uppfæra setningu" required/>

                          <Button type='submit'>Uppfæra Setningu</Button>
                        </form>
                      </div>
                    ) : null}

                    {loginContext.userLoggedIn.login && loginContext.userLoggedIn.user.admin ? (
                      <div><Button onClick={async (event: any) => {
                        event.preventDefault();
                        try {
                          await adminDeleteSentenceHandler(token, value.id);
                          router.reload();
                        } catch(e: any) {
                          setError(e.message);
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
                  onSubmit={async (event: any) => {
                    event.preventDefault();
                    try {
                      await adminRegisterSentenceHandler(event, token);
                      router.reload();
                    } catch(e: any) {
                      setError(e.error);
                    }

                  }}
                >
                  {error && <p>{error}</p>}

                  <label htmlFor='sentence'>Setning:</label>

                  <input type='text' id='sentence' placeholder="Skrá setningu" required/>

                  <Button type='submit'>Skrá setningu</Button>
                </form>
              </div>
            ) : null }

          </div>
        </div>
      </main>
    </>
  )
}
