import { useUserContext } from '@/context';
import Link from 'next/link';
import s from './Header.module.scss';


export default function Header() {
  const loginContext = useUserContext();
  return (
    <header className={s.header}>
      <h1><Link href='/' >Forsíða</Link></h1>
      {loginContext.userLoggedIn.login && loginContext.userLoggedIn.user.admin ? (
        <>
          <h3><Link href='/sentences'>Setningar</Link></h3>
          <h3><Link href='/sentences/simplified'>Einfaldaðar Setningar</Link></h3>
          <h3><Link href='/users'>Notendur</Link></h3>
        </>
      ) : (
        <>
          {loginContext.userLoggedIn.login ? (
            <>
              <h3><Link href='/simplify'>Einfalda</Link></h3>
              <h3><Link href='/verify'>Yfirferð</Link></h3>
              <h3><Link href='/account'>Minn Aðgangur</Link></h3>
            </>
          ) : (
            <>
              <h3><Link href='/login'>Innskráning</Link></h3>
            </>
          )}
        </>
      )}
    </header>
  )
}