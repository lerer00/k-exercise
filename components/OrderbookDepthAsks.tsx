import React, { FunctionComponent, useContext } from 'react';
import OrderbookContext, { OrderbookPriceType } from '../contexts/orderbookContext';
import styles from './orderbookDepth.module.css';
import OrderbookDepthRow from './OrderbookDepthRow';

interface Props {
}

const findDepth = (entries: OrderbookPriceType[], price: number): number => {
    return entries.filter((e: OrderbookPriceType) => e.price >= price).map((e) => { return e.size }).reduce((a: number, b: number) => a + b, 0);
}

const OrderbookDepthAsks: FunctionComponent<Props> = () => {
    const context = useContext(OrderbookContext);

    const group = (): OrderbookPriceType[] => {
        let shallowCopyAsks = context.asks.map(a => { return { ...a } });
        let groupAsks: OrderbookPriceType[] = [];

        let nextLimit = shallowCopyAsks[0].price - context.grouping;
        let currentGroup: OrderbookPriceType = {
            price: shallowCopyAsks[0].price,
            size: 0
        };
        for (let i = 0; i < shallowCopyAsks.length - 1; i++) {
            if (shallowCopyAsks[i].price >= nextLimit) {
                currentGroup.size += shallowCopyAsks[i].size;
            } else {
                groupAsks.push(currentGroup);
                if (i <= shallowCopyAsks.length - 1) {
                    nextLimit = shallowCopyAsks[i + 1].price - context.grouping;
                    currentGroup = {
                        price: nextLimit,
                        size: 0
                    }
                }
            }
        }

        return groupAsks;
    }

    return (
        <>
            <div className={styles.orderbook_depth}>
                <div className={styles.headers}>
                    <span>Total</span>
                    <span>Size</span>
                    <span>Price</span>
                </div>
                <div>
                    {context.asks.length > 0 && <div>
                        {group().map((p: OrderbookPriceType, i: number) => {
                            return <OrderbookDepthRow key={i} size={p.size} price={p.price} depth={findDepth(context.asks, p.price)} maxDepth={context.depth} />
                        })}
                    </div>}
                </div>
            </div>
        </>
    )
}

export default OrderbookDepthAsks;