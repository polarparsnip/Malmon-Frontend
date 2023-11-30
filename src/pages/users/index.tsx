import { Button } from '@/components/Button/Button'
import UserCard from '@/components/UserCard/UserCard'
import Paging from '@/components/paging/Paging'
import { useUserContext } from '@/context'
import styles from '@/styles/Home.module.css'
import { Query, User, Users } from '@/types'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const adminDeleteUserHandler = async (token: any, userId: number) => {
  
  const res = await fetch(`${baseUrl}/admin/users/${userId}`, {
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
  
  const req = await fetch(`${baseUrl}/users/?${off}&${lim}`);
  const users = await req.json();

  if (!users) {
    return {
      props: {},
    };
  }

  return {
    props: { query, users },
  }
}

export default function UsersPage({ query, users }: { query: Query, users: Users }) {
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

  if (!users) {
    return <h1>Engin gögn fundust.</h1>;
  }

  return (
    <>
      <Head>
        <title>Notendur</title>
        <meta name="description" content="Setningarsöfnun" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8"></meta>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        {loginContext.userLoggedIn.login && loginContext.userLoggedIn.user.admin ? (
          <>
            <div className={styles.cards}>
            
              {users.users.map((value: User) => (
                  <div className={styles.card} key={value.id} >

                    <UserCard value={value} ></UserCard>

                    {loginContext.userLoggedIn.login && loginContext.userLoggedIn.user.admin ? (
                      <Button className={styles.soloButton} onClick={async () => {
                        const deletedSentence = await adminDeleteUserHandler(token, value.id);
                        if (deletedSentence !== undefined) {
                          router.reload();
                        } else {
                          console.error( {error: deletedSentence})
                        }
                      }}>Eyða Notanda</Button>) : null
                    }

                  </div>
                ))}
            
            </div>

            {!(users.users.length < 10 && (query.offset === 0 || query.offset === undefined)) ? (
              <div className='paging'>
                <Paging paging={users} query={query} page={'users'}></Paging>
              </div>
            ) : null}
          </>) : (<h1>Síða fannst ekki</h1>)
        }
      </main>
    </>
  )
}
