import styles from '@/styles/Home.module.css'
import { Inter } from 'next/font/google'
import Head from 'next/head'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>Forsíða</title>
        <meta name="description" content="Setningarsöfnun" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <div className={styles.container}>
          <div className={styles.indexInfo}>
            <h1>Velkomin</h1>

            <p>Þessi vefsíða er til að safna hlaða niður gögnum sem hægt er að nýta til frekari 
              rannsókna og þróunar á gervigreindar mállíkunum.
            </p>
            <p>Þessi gögn eru á formi einfaldaðra setninga frá notendum sem eru gerðar útfrá
              flóknari setningum sem koma frá mismunandi stöðum eins og fréttasíðum osf.
            </p>
            <p>Síðan er með einfalt viðmót sem auðvelt er að nota.
            </p> 
            <p>Til að hlaða niður þeim gögnum sem komin eru hingað til er hægt að smella 
              á &quot;Sækja gögn&quot; fyrir ofan í valmyndinni
            </p> 
            <p>Til að leggja fram aðstoð og einfalda setningar þarf einfaldlega bara
              að skrá sig inn og smella á &quot;Einfalda&quot; í valmyndinni. Þá birtist flókin setning
              og textareitur sem hægt að skrifa inn í. Skrifaðu þá einfaldari útgáfu af setningunni 
              í textareitin og smelltu á &quot;Senda inn&quot; til að senda inn einfölduðu setninguna.
            </p>
            <p>Innsendar setningar þurfa svo að vera staðfestar af öðrum notendum til að komast inn í
              gagnasettið. Til að yfirfara setningar frá öðrum skaltu smella á &quot;Yfirfara&quot; í 
              valmyndinni. Þá færðu upp setningu og einfalda útgáfu af henni sem var send inn af öðrum 
              notanda. Eftir að 10 sekúndur líða kemur upp takki sem hægt er að ýta á til að staðfesta
              að einfalda setningin sé nógu góð einföldun.
            </p>
            <p>Inn í &quot;Aðgangur&quot; í valmyndinni er svo hægt að sjá upplýsingarnar þínar, eins og 
              fjölda innsendra einfaldaðra setninga og fjölda yfirfarða setninga.
            </p>
            <p>Svo ef smellt er á &quot;Stigatafla&quot; í valmyndinni er hægt að skoða hverjir hafa lagt 
              mest af mörkum og sent inn mest af setningum og klárað sem flestar yfirferðir.
            </p>
            <p>Ef þú ert ekki með notanda aðgang er einfalt að búa einn til. Smelltu annaðhvort á 
            &quot;Nýskráning&quot; á innskráningarsíðunni eða fyrir neðan í fótnum. Þar þarf svo einfaldlega
            bara að gefa upp nafn og notandanafn ásamt lykilorð. Eftir það er svo hægt að skrá sig inn 
            og taka þátt.
            </p>
          </div>
        </div>
      </main>
    </>
  )
}
