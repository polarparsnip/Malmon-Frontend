import { useUserContext } from '@/context';
import styles from '@/styles/Home.module.css';
import { User } from '@/types';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useState } from 'react';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  let res;
  try {
    res = await fetch(`${baseUrl}/users/me`, {
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
    console.error(message.error)

    return {
      props: { errorMessage: message.error || 'unknown error'},
    };
  }

  const userInfo = await res.json();

  if (!userInfo) {
    return {
      props: {},
    };
  }
  
  return {
    props: { userInfo },
  }
}

export default function UserAccountPage( 
  { userInfo, errorMessage }: { userInfo: User, errorMessage: any } 
) {
  // const router = useRouter();
  // const [token, setToken] = useState('');
  const loginContext = useUserContext();
  const [error, setError] = useState(null);


  // useEffect(() => {
  //   const checkLogin = async () => {
  //     const {user} = loginContext.userLoggedIn;
  //     if(user !== undefined){
  //       const cookieToken = Cookies.get('token');
  //       if(cookieToken) setToken(cookieToken);
  //     }
  //   }
  //   checkLogin();
  // }, [loginContext, router])

  if(errorMessage && errorMessage !== error) {
    setError(errorMessage);
  }

  if (!userInfo) {
    return (
      <>
        <Head>
          <title>Aðgangur</title>
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

  if (!userInfo.username) {
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

  let content;
  if (userInfo.completedverifications +  userInfo.completedsentences > 50) {
    content = 
      <Image
        src={'/pet_img/5.png'}
        width={230}
        height={200}
        className={styles.digitalPet}
        alt="pet"
      />;
  } else if (userInfo.completedverifications +  userInfo.completedsentences > 40) {
    content = 
      <Image
        src={'/pet_img/4.png'}
        width={280}
        height={200}
        className={styles.digitalPet}
        alt="pet"
      />;
  } else if (userInfo.completedverifications +  userInfo.completedsentences > 30) {
    content = 
      <Image
        src={'/pet_img/3.png'}
        width={200}
        height={200}
        className={styles.digitalPet}
        alt="pet"
      />;
  } else if (userInfo.completedverifications +  userInfo.completedsentences > 20) {
    content = 
      <Image
        src={'/pet_img/2.png'}
        width={200}
        height={200}
        className={styles.digitalPet}
        alt="pet"
      />;
  } else if (userInfo.completedverifications +  userInfo.completedsentences > 10) {
    content = 
      <Image
        src={'/pet_img/1.png'}
        width={220}
        height={200}
        className={styles.digitalPet}
        alt="pet"
      />;
  } else {
    content =               
    <Image
      src={'/pet_img/0.png'}
      width={180}
      height={200}
      className={styles.digitalPet}
      alt="pet"
    />;
  }


  return (
    <>
      <Head>
        <title>Aðgangur</title>
        <meta name="description" content="Setningarsöfnun" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8"></meta>
        <link rel="icon" href="/mlogo.png" />
      </Head>
      <main className={styles.main}>
          <>
            <div className={styles.grid} >

              <div className={styles.userInfo}>
                <h3>Notendanafn: {userInfo.username}</h3>

                <h3>Nafn: {userInfo.name}</h3>

                <p>Kláraðar setningar: {userInfo.completedsentences}</p>

                <p>Yfirfarnar setningar: {userInfo.completedverifications}</p>
                
                {content}

              </div>

            </div>    
          </>
      </main>
    </>
  )
}
