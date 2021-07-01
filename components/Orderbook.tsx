import styles from './orderbook.module.css';
import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import OrderbookContext from '../contexts/orderbookContext';
import OrderbookDepth, { OrderbookDirection } from './OrderbookDepth';

interface Props {
}

const Orderbook: FunctionComponent<Props> = () => {
    const [maxDepth, setMaxDepth] = useState(0);
    const context = useContext(OrderbookContext)

    useEffect(() => {
        if (context.asks !== undefined && context.bids !== undefined &&
            context.asks.length > 0 && context.bids.length > 0) {
            let maxAsks = Math.max(context.asks[context.asks.length - 1].depth, context.asks[0].depth);
            let maxBids = Math.max(context.bids[context.bids.length - 1].depth, context.bids[0].depth)

            setMaxDepth(Math.max(maxBids, maxAsks));
        }
    });

    return (
        <>
            <div className={styles.orderbook}>
                <h1>Order Book</h1>
                <div className={styles.dom}>
                    <div className={styles.asks}>
                        <OrderbookDepth data={context.asks} depth={maxDepth} direction={OrderbookDirection.ASK} />
                    </div>
                    <div className={styles.bids}>
                        <OrderbookDepth data={context.bids} depth={maxDepth} direction={OrderbookDirection.BID} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Orderbook;