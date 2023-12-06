import { useUserContext } from '@/context';
import Image from 'next/image';
import Link from 'next/link';
import s from './Header.module.scss';



export default function Header() {
  const loginContext = useUserContext();
  return (
    <header className={s.header}>
      <div className={s.header__title}>
      <Image
            src='/mlogo.png'
            alt='Logo'
            className={s.logo}
            width={40}
            height={40}
            priority
          />
        <h1><Link href='/' >Forsíða</Link></h1>
      </div>
      
      <div className={s.header__navigation}>
        {loginContext.userLoggedIn.login ? (
          <>
            <p><Link href='/download'>Sækja gögn</Link></p>
            <p><Link href='/leaderboard'>Stigatafla</Link></p>
            <p><Link href='/simplify'>Einfalda</Link></p>
            <p><Link href='/verify'>Yfirferð</Link></p>
            {loginContext.userLoggedIn.login && loginContext.userLoggedIn.user.admin ? (
              <p><Link href='/admin'>Admin svæði</Link></p>
            ) : (
              <>
              <p><Link href='/account'>Minn Aðgangur</Link></p>
              </>
            )}

          </>
        ) : (
          <>
            <p><Link href='/download'>Sækja gögn</Link></p>
            <p><Link href='/login'>Innskráning</Link></p>
          </>
        )}
      </div>
    </header>
  )
}