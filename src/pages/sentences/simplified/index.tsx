import { Button } from '@/components/Button/Button'
import SentenceCard from '@/components/SentenceCard/SentenceCard'
import Paging from '@/components/paging/Paging'
import { useUserContext } from '@/context'
import styles from '@/styles/Home.module.css'
import { Query, SimplifiedSentence, SimplifiedSentences } from '@/types'
import Cookies from 'js-cookie'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const baseUrl = process.env.NEXT_PUBLIC_API_URL;


const adminDeleteSimplifiedSentenceHandler = async (event: any, token: any, sentenceId: number) => {
  event.preventDefault();
  
  const res = await fetch(`${baseUrl}/admin/sentences/simplified/${sentenceId}`, {
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

const adminUndoSimplifiedRejectionHandler = async (event: any, token: any, sentenceId: number) => {
  event.preventDefault();

  const formData = new FormData();

  formData.append('rejected', 'false');
  

  const res = await fetch(`${baseUrl}/admin/sentences/simplified/${sentenceId}/undo`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
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

  let res;
  try {
    res = await fetch(`${baseUrl}/admin/sentences/simplified/?${off}&${lim}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${context.req.cookies.token}`,
      },
    });
  } catch(e) {
    console.error('error', e);
  }

  let simplifiedSentences;
  
  try {
    simplifiedSentences = await res?.json();
  } catch(e) {
    console.error('error', e);
  }
  

  if (!simplifiedSentences) {
    return {
      props: {},
    };
  }

  return {
    props: { query, simplifiedSentences },
  }
}

export default function SimplifiedSentencesPage(
  { query, simplifiedSentences }: { query: Query, simplifiedSentences: SimplifiedSentences }
) {
  const router = useRouter();
  const [token, setToken] = useState('');
  const loginContext = useUserContext();

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

  if (!simplifiedSentences) {
    return (
      <>
        <Head>
          <title>Einfaldaðar Setningar</title>
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

  if (!simplifiedSentences.simplifiedSentences) {
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
        <title>Einfaldaðar Setningar</title>
        <meta name="description" content="Setningarsöfnun" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8"></meta>
        <link rel="icon" href="/mlogo.png" />
      </Head>
      <main className={styles.main}>

   
          <div className={styles.cards}>
            <div className={styles.adminSentences}>
                {simplifiedSentences.simplifiedSentences.map((value: SimplifiedSentence) => (
                  <div className={styles.card} key={value.id} >

                    <SentenceCard value={value.simplifiedsentence} ></SentenceCard>

                    {loginContext.userLoggedIn.login && loginContext.userLoggedIn.user.admin ? (
                      <>
                        {value.rejected ? (<p>Hefur verið hafnað</p>) : (<p>Hefur ekki verið hafnað</p>)}
                        {value.verified ? (<p>Hefur verið staðfest</p>) : (<p>Hefur ekki verið staðfest</p>)}
                        <div className={styles.adminSimplifiedButtons}>
                        <Button onClick={async (event: any) => {
                            const undoRejection = await adminUndoSimplifiedRejectionHandler(
                              event,
                              token, 
                              value.id
                            );
                              if (undoRejection !== undefined) {
                                router.reload();
                              } else {
                                console.error( {error: undoRejection})
                              }
                            }}>
                              Eyða Höfnun
                          </Button>
                          <Button onClick={async (event: any) => {
                            const deletedSentence = await adminDeleteSimplifiedSentenceHandler(
                              event,
                              token, 
                              value.id
                            );
                              if (deletedSentence !== undefined) {
                                router.reload();
                              } else {
                                console.error( {error: deletedSentence})
                              }
                            }}>
                              Eyða Setningu
                          </Button>
                        </div>
                      </>) : (<></>)
                      
                    }

                  </div>
                ))}
              
            </div>

              {!(simplifiedSentences.simplifiedSentences.length < 10 
              && (query.offset === 0 || query.offset === undefined)) ? (
                <div className='paging'>
                  <Paging paging={simplifiedSentences} query={query} page={'sentences/simplified'}></Paging>
                </div>
              ) : null}
            
          </div>
      

      </main>
    </>
  )
}
