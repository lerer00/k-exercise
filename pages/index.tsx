import Head from 'next/head'
import Orderbook from '../components/Orderbook';
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>k-exercise</title>
        <meta name="description" content="Depth visualizer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {/* <span>The WebSocket is currently {connectionStatus}</span>
        <button onClick={handleConnect} disabled={readyState !== ReadyState.OPEN}>Connect to {market}</button> */}

        {/* {lastMessage ? <span>Last message: {lastMessage.data}</span> : null} */}


        <Orderbook />
      </main>
    </div>
  )
}
