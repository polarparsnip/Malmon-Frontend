import styles from '@/styles/Home.module.css'
import { Inter } from 'next/font/google'
import Head from 'next/head'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>Admin Svæði</title>
        <meta name="description" content="Setningarsöfnun" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/mlogo.png" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <div className={styles.container}>
          <div className={styles.adminEditor}>
            <h1>Ritskoðun</h1>

            <h3><Link href='/sentences'>Setningar</Link></h3>
  
            <h3><Link href='/sentences/simplified'>Einfaldaðar Setningar</Link></h3>

            <h3><Link href='/users'>Notendur</Link></h3>
          </div>
        </div>
      </main>
    </>
  )
}
