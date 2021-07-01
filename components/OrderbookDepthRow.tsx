import { FunctionComponent } from 'react';
import styles from './orderbookDepthRow.module.css';

interface Props {
    size: number,
    price: number,
    depth: number,
    maxDepth: number,
    inverted?: boolean,
}

const OrderbookDepthRow: FunctionComponent<Props> = ({ size, price, depth, maxDepth, inverted }) => {
    return (
        <>
            {!inverted && <div className={styles.row}>
                <span className={styles.highest} style={{ width: ((depth) / maxDepth * 100).toString() + '%' }}></span>
                <span>{depth}</span>
                <span>{size}</span>
                <span className={styles.price}>{price}</span>
            </div>}
            {inverted && <div className={`${styles.row} ${styles.inverted}`}>
                {/* {console.log(((depth) / maxDepth * 100).toString())} */}
                <span className={styles.highest} style={{ width: ((depth) / maxDepth * 100).toString() + '%' }}></span>
                <span className={styles.price}>{price}</span>
                <span>{size}</span>
                <span>{depth}</span>
            </div>}
        </>
    )
}

export default OrderbookDepthRow;