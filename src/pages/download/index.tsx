import { Button } from '@/components/Button/Button'
import { getData } from '@/csv_downloader.js'
import styles from '@/styles/Home.module.css'
import { Inter } from 'next/font/google'
import Head from 'next/head'

const inter = Inter({ subsets: ['latin'] })

export default function DownloadPage() {
  return (
    <>
      <Head>
        <title>Niðurhal</title>
        <meta name="description" content="Setningarsöfnun" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/mlogo.png" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <div className={styles.container}>
          <div className={styles.downloadContainer}>

            <p>Hlaða gögnum:</p>

            <Button onClick={async () => {
                const downloadData = await getData('json');
                if (downloadData === undefined) {
                  console.error( {error: 'Could not download sentence data'});
                }
            }}>
              Hlaða gögnum sem JSON
            </Button>

            <Button onClick={async () => {
                const downloadData = await getData('csv');
                if (downloadData === undefined) {
                  console.error( {error: 'Could not download sentence data'});
                }
            }}>
              Hlaða gögnum sem CSV
            </Button>
          </div>
        </div>
      </main>
    </>
  )
}
