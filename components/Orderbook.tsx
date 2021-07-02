import Image from 'next/image';
import styles from './orderbook.module.css';
import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { Button, FormControl, MenuItem, Select } from '@material-ui/core';
import OrderbookContext, { initialOrderbookContext, markets, OrderbookPriceType } from '../contexts/orderbookContext';
import OrderbookDepthAsks from './OrderbookDepthAsks';
import OrderbookDepthBids from './OrderbookDepthBids';
import { ascNumberArray, ascOrderbookPrice, descNumberArray, descOrderbookPrice } from '../utilities/sort';

interface Props {
}

export enum SOCKET_STATE {
    CLOSED = 0,
    OPENED = 1,
    LOADING = 2
}

const Orderbook: FunctionComponent<Props> = () => {
    const [market, setMarket] = useState(initialOrderbookContext.market);
    const [grouping, setGrouping] = useState(initialOrderbookContext.grouping);
    const [asks, setAsks] = useState(initialOrderbookContext.asks);
    const [bids, setBids] = useState(initialOrderbookContext.bids);
    const [depth, setDepth] = useState(initialOrderbookContext.depth);
    const [lastMessage, setLastMessage] = useState(null);
    const [socketState, setSocketState] = useState(SOCKET_STATE.LOADING);
    const webSocket: any = useRef(null);

    const initWebSocket = () => {
        webSocket.current = new WebSocket('wss://www.cryptofacilities.com/ws/v1');
        webSocket.current.onopen = function (evt: any) { onOpen(evt) };
        webSocket.current.onclose = function (evt: any) { onClose(evt) };
        webSocket.current.onerror = function (evt: any) { onError(evt) };
        webSocket.current.onmessage = function (evt: any) { onMessage(evt) };
    }

    const onOpen = (_: any) => {
        webSocket.current?.send('{ "event": "subscribe", "feed": "book_ui_1", "product_ids": ["' + market.id + '"] }');
        setSocketState(SOCKET_STATE.OPENED);
    }
    const onClose = (_: any) => {
        setSocketState(SOCKET_STATE.CLOSED);
    }
    const onError = (_: any) => {
        setSocketState(SOCKET_STATE.CLOSED);
    }

    const onMessage = (event: any) => {
        var message = JSON.parse(event.data);
        setLastMessage(message);
    }

    const killFeed = () => {
        if (socketState !== SOCKET_STATE.OPENED) {
            initWebSocket();
        } else {
            webSocket.current?.close();
        }
    }

    const toggleFeed = () => {
        if (market.id === 'PI_XBTUSD') {
            unsubscribeFeed('PI_XBTUSD');
            subscribeFeed('PI_ETHUSD');
            setMarket(markets.PI_ETHUSD);
            setGrouping(markets.PI_ETHUSD.groupings[0])
        } else {
            unsubscribeFeed('PI_ETHUSD');
            subscribeFeed('PI_XBTUSD');
            setMarket(markets.PI_XBTUSD);
            setGrouping(markets.PI_XBTUSD.groupings[0])
        }
    };

    const unsubscribeFeed = (feed: string) => {
        webSocket.current?.send('{ "event": "unsubscribe", "feed": "book_ui_1", "product_ids": ["' + feed + '"]}')
    };

    const subscribeFeed = (feed: string) => {
        webSocket.current?.send('{ "event": "subscribe", "feed": "book_ui_1", "product_ids": ["' + feed + '"] }')
    };

    const handleChangeGrouping = (event: React.ChangeEvent<any>) => {
        setGrouping(parseFloat(event.target.value));
    }

    const updateOrderbook = (message: any) => {
        if (message === undefined || message === null) {
            return;
        }

        if (message.hasOwnProperty('event') && message.event === 'subscribed') {
            // setAsks(initialOrderbookContext.asks);
            setBids(initialOrderbookContext.bids);
            setDepth(initialOrderbookContext.depth);

            return;
        }

        if (message.hasOwnProperty('event') && message.event === 'unsubscribed') {
            // setAsks(initialOrderbookContext.asks);
            setBids(initialOrderbookContext.bids);
            setDepth(initialOrderbookContext.depth);

            return;
        }

        if (message.hasOwnProperty('feed') && message.feed === 'book_ui_1_snapshot') {
            // First snapshot need to bed sorted and mapped to correct DTO.
            let tempAsks: OrderbookPriceType[] = message.asks.sort(descNumberArray).map((ask: number[]) => {
                return {
                    price: ask[0],
                    size: ask[1]
                }
            });
            setAsks(tempAsks);

            let tempBids: OrderbookPriceType[] = message.bids.sort(ascNumberArray).map((bid: number[]) => {
                return {
                    price: bid[0],
                    size: bid[1]
                }
            });
            setBids(tempBids);

            return;
        }

        if (message.hasOwnProperty('feed') && message.feed === 'book_ui_1') {
            if (message.asks.length > 0) {
                let shallowCopyAsks = asks.map(a => { return { ...a } });

                let modifiedAsks: OrderbookPriceType[] = message.asks.map((a: number[][]) => { return { price: a[0], size: a[1] } });
                for (let i = 0; i < modifiedAsks.length - 1; i++) {
                    let indexToModify = shallowCopyAsks.findIndex((a: OrderbookPriceType) => a.price === modifiedAsks[i].price);

                    if (modifiedAsks[i].size === 0) {
                        // In this case we should delete the occurence in the array.
                        shallowCopyAsks.splice(indexToModify, 1);
                    } else {
                        // In this case we should overwrite the occurence in the array.
                        if (indexToModify === -1) {
                            // This is a new object.
                            shallowCopyAsks.push(modifiedAsks[i]);
                            shallowCopyAsks = shallowCopyAsks.sort(descOrderbookPrice);

                        } else {
                            // This is an exisiting object.
                            shallowCopyAsks[indexToModify] = modifiedAsks[i];
                        }
                    }
                }

                setAsks(shallowCopyAsks);
            }

            if (message.bids.length > 0) {
                let shallowCopyBids = bids.map(a => { return { ...a } });

                let modifiedBids: OrderbookPriceType[] = message.bids.map((b: number[][]) => { return { price: b[0], size: b[1] } });
                for (let i = 0; i < modifiedBids.length - 1; i++) {
                    let indexToModify = shallowCopyBids.findIndex((b: OrderbookPriceType) => b.price === modifiedBids[i].price);

                    if (modifiedBids[i].size === 0) {
                        // In this case we should delete the occurence in the array.
                        shallowCopyBids.splice(indexToModify, 1);
                    } else {
                        // In this case we should overwrite the occurence in the array.
                        if (indexToModify === -1) {
                            // This is a new object.
                            shallowCopyBids.push(modifiedBids[i]);
                            shallowCopyBids = shallowCopyBids.sort(ascOrderbookPrice);
                        } else {
                            // This is an exisiting object.
                            shallowCopyBids[indexToModify] = modifiedBids[i];
                        }
                    }
                }

                setBids(shallowCopyBids);
            }

            return;
        }
    }

    useEffect(() => {
        // Connect to feed on first load.
        initWebSocket();
    }, []);

    useEffect(() => {
        let maxAsks = asks.map((a) => { return a.size }).reduce((a: number, b: number) => a + b, 0);
        let maxBids = bids.map((b) => { return b.size }).reduce((a: number, b: number) => a + b, 0);

        setDepth(Math.max(maxBids, maxAsks));

    }, [asks, bids]);

    useEffect(() => {
        if (lastMessage !== null) {
            updateOrderbook(lastMessage);
        }
    }, [lastMessage])

    return (
        <>
            <OrderbookContext.Provider value={{ market: market, grouping: grouping, handleChangeGrouping: handleChangeGrouping, asks: asks, bids: bids, depth: depth }}>
                <div className={styles.actions}>
                    <Button color="primary" variant="contained" onClick={toggleFeed}><Image width={24} height={24} src={'/images/toggle-feed.svg'} alt={'toggle feed button'} /> Toggle Feed</Button>
                    <Button color="secondary" variant="contained" onClick={killFeed}><Image width={24} height={24} src={'/images/kill-feed.svg'} alt={'kill feed button'} /> Kill Feed</Button>
                </div>
                <div className={styles.orderbook}>
                    <div className={styles.header}>
                        <h1>Order Book</h1>
                        <FormControl>
                            <Select
                                className={styles.select}
                                labelId="grouping-select"
                                id="grouping-select"
                                value={grouping}
                                onChange={handleChangeGrouping}
                            >
                                {market.groupings.map((g, i) => {
                                    return <MenuItem key={i} value={g}>Group {g}</MenuItem>
                                })}
                            </Select>
                        </FormControl>
                    </div>
                    <div className={styles.dom}>
                        {socketState === SOCKET_STATE.OPENED &&
                            <>
                                <div className={styles.asks}>
                                    <OrderbookDepthAsks />
                                </div>
                                <div className={styles.bids}>
                                    <OrderbookDepthBids />
                                </div>
                            </>
                        }
                        {socketState === SOCKET_STATE.CLOSED && <div className={styles.bids}>
                            <div className={styles.loading}>
                                <Image width={24} height={24} src={'/images/loading.svg'} alt={'loading image'} />
                                <p>Yeah Sorry looks like the feed is broken!</p>
                            </div>
                        </div>}
                        {socketState === SOCKET_STATE.LOADING && <div className={styles.bids}>
                            <div className={styles.loading}>
                                <Image width={24} height={24} src={'/images/loading.svg'} alt={'loading image'} />
                                <p>Connecting to feed...</p>
                            </div>
                        </div>}
                    </div>
                </div>
            </OrderbookContext.Provider>
        </>
    )
}

export default Orderbook;