import { useUserContext } from '@/context'
import styles from '@/styles/Home.module.css'
import { User } from '@/types'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import Head from 'next/head'

const baseUrl = process.env.NEXT_PUBLIC_API_URL;


export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {

  const res = await fetch(`${baseUrl}/users/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${context.req.cookies.token}`,
    },
  });
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
  { userInfo }: { userInfo: User } 
) {
  // const router = useRouter();
  // const [token, setToken] = useState('');
  const loginContext = useUserContext();

  // useEffect(() => {
  //   const checkLogin = async () => {
  //     const {user} = loginContext.userLoggedIn;

  //     if(user !== undefined){
  //       // const localToken = localStorage.getItem('token');
  //       // if(localToken) setToken(localToken);
  //       const cookieToken = Cookies.get('token');
  //       if(cookieToken) setToken(cookieToken);
  //     }
  //   }
  //   checkLogin();
  // }, [loginContext, router])

  // console.log(loginContext.userLoggedIn)

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


  return (
    <>
      <Head>
        <title>Aðgangur</title>
        <meta name="description" content="Setningarsöfnun" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8"></meta>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        {/* {loginContext.userLoggedIn.login ? ( */}
          <>
            <div className={styles.cards} >

              <div className={styles.userInfo}>
                <h3>Notendanafn: {userInfo.username}</h3>
                <br/>
                <h3>Nafn: {userInfo.name}</h3>
                <br/>
                <p>Kláraðar setningar: {userInfo.completedsentences}</p>
                <br/>
                <p>Yfirfarnar setningar: {userInfo.completedverifications}</p>
              </div>

            </div>    
          </>
        {/* ) : (
          <div className={styles.notFound}>
            <h1>Síða fannst ekki</h1>
          </div>
        )} */}
      </main>
    </>
  )
}
