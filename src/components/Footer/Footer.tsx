import { useUserContext } from '@/context';
import Link from 'next/link';
import { Button } from '../Button/Button';
import s from './Footer.module.scss';


export default function Footer() {
  const loginContext = useUserContext();
  return (
    <footer className={s.footer} >
      {loginContext.userLoggedIn.login ? (
        <p>Skráður inn sem {loginContext.userLoggedIn.user.username}</p>) : (
        <div>
          <p><Link className={s.footer__link} href='/login'>Innskráning</Link></p>
          <br></br>
          <p><Link className={s.footer__link} href='/register'>Nýskráning</Link></p>
        </div>
      )}
      {loginContext.userLoggedIn.login ? (
        <Button onClick={loginContext.logOut}>Útskrá</Button>) : (<div></div>
      )}
    </footer>
  )
}