import React, { FunctionComponent } from 'react';
import { OrderbookPricetype } from '../contexts/orderbookContext';
import styles from './orderbookDepth.module.css';
import OrderbookDepthRow from './OrderbookDepthRow';

export enum OrderbookDirection {
    ASK = 0,
    BID = 1
}

interface Props {
    data: OrderbookPricetype[],
    depth: number,
    direction: OrderbookDirection
}

const OrderbookDepth: FunctionComponent<Props> = ({ data, depth, direction }) => {

    return (
        <>
            <div className={styles.orderbook_depth}>
                <div className={styles.headers}>
                    {direction === OrderbookDirection.ASK && <>
                        <span>Total</span>
                        <span>Size</span>
                        <span>Price</span>
                    </>}
                    {direction === OrderbookDirection.BID && <>
                        <span>Price</span>
                        <span>Size</span>
                        <span>Total</span>
                    </>}
                </div>
                <div>
                    {data.length > 0 && direction === OrderbookDirection.ASK && <div>
                        {data.map((p: OrderbookPricetype, i: number) => {
                            return <OrderbookDepthRow key={i} size={p.size} price={p.price} depth={p.depth} maxDepth={depth} />
                        })}
                    </div>}
                    {data.length > 0 && direction === OrderbookDirection.BID && <div>
                        {data.map((p: OrderbookPricetype, i: number) => {
                            return <OrderbookDepthRow key={i} size={p.size} price={p.price} depth={p.depth} maxDepth={depth} inverted={true} />
                        })}
                    </div>}
                </div>
            </div>
        </>
    )
}

export default OrderbookDepth;