import Head from 'next/head'
import { useCallback, useEffect, useReducer, useState } from 'react';
import Orderbook from '../components/Orderbook';
import OrderbookContext, { initialOrderbookContext } from '../contexts/orderbookContext'
import styles from '../styles/Home.module.css'
import useWebSocket, { ReadyState } from 'react-use-websocket';
import orderbookContext from '../contexts/orderbookContext';

export default function Home() {
  const [socketUrl, setSocketUrl] = useState('wss://www.cryptofacilities.com/ws/v1');
  const [market, setMarket] = useState('PI_XBTUSD');
  const [orderbook, setOrderbook] = useState(initialOrderbookContext);

  const {
    sendMessage,
    lastMessage,
    readyState
  } = useWebSocket(socketUrl);

  const handleConnect = useCallback(() => sendMessage('{ "event": "subscribe", "feed": "book_ui_1", "product_ids": ["' + market + '"] }'), []);

  // const connectionStatus = {
  //   [ReadyState.CONNECTING]: 'Connecting',
  //   [ReadyState.OPEN]: 'Open',
  //   [ReadyState.CLOSING]: 'Closing',
  //   [ReadyState.CLOSED]: 'Closed',
  //   [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  // }[readyState];

  const updateOrderbook = (message: any) => {
    var data = JSON.parse(message?.data);

    if (data === undefined || data === null) {
      return;
    }

    let depth = 0;
    if (data.hasOwnProperty('numLevels')) {
      let orderbookWithDepth = initialOrderbookContext;
      orderbookWithDepth.product = data.product_id;

      orderbookWithDepth.asks = data.asks.sort((a: number[], b: number[]) => {
        if (a[0] < b[0]) {
          return 1;
        }
        if (a[0] > b[0]) {
          return -1;
        }
        return 0;
      }).map((ask: number[]) => {
        depth += ask[1];

        return {
          price: ask[0],
          size: ask[1],
          depth: depth
        }
      });

      orderbookWithDepth.bids = data.bids.sort((a: number[], b: number[]) => {
        if (a[0] < b[0]) {
          return -1;
        }
        if (a[0] > b[0]) {
          return 1;
        }
        return 0;
      }).map((bid: number[]) => {
        depth += bid[1];

        return {
          price: bid[0],
          size: bid[1],
          depth: depth
        }
      });

      setOrderbook(orderbookWithDepth);
      return;
    } else {
      
    }
  }

  useEffect(() => {
    if (lastMessage !== null) {
      updateOrderbook(lastMessage);
    }
  }, [lastMessage]);


  useEffect(() => {
    handleConnect();
  }, []);

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

        <OrderbookContext.Provider value={orderbook}>
          <Orderbook></Orderbook>
        </OrderbookContext.Provider>
      </main>
    </div>
  )
}
