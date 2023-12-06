import Leaderboard from '@/components/Leaderboard/Leaderboard'
import Paging from '@/components/paging/Paging'
import { useUserContext } from '@/context'
import styles from '@/styles/Home.module.css'
import { Query, Users } from '@/types'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import Head from 'next/head'



const baseUrl = process.env.NEXT_PUBLIC_API_URL;


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
    res = await fetch(`${baseUrl}/users/?order=leaderboard&${off}&${lim}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${context.req.cookies.token}`,
      },
    });
  } catch(e) {
    console.error('error', e);
  }

  let users;

  try {
    users = await res?.json();
  } catch(e) {
    console.error('error', e);
  }

  if (!users) {
    return {
      props: {},
    };
  }

  return {
    props: { query, users },
  }
}

export default function LeaderboardPage({ query, users }: { query: Query, users: Users }) {
  const loginContext = useUserContext();

  if (!users) {
    return (
      <>
        <Head>
          <title>Stigatafla</title>
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

  if (!users.users) {
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
        <title>Stigatafla</title>
        <meta name="description" content="Setningarsöfnun" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8"></meta>
        <link rel="icon" href="/mlogo.png" />
      </Head>
      <main className={styles.main}>

          <div className={styles.cards}>

            <div className={styles.leaderboard}>
              <Leaderboard users={users} />

              {!(users.users.length < 10 && (query.offset === 0 || query.offset === undefined)) ? (
                <div className='paging'>
                  <Paging paging={users} query={query} page={'users'}></Paging>
                </div>
              ) : null}

            </div>
          </div>

      </main>
    </>
  )
}
