import React from "react";

export const markets = {
    ['PI_XBTUSD']: {
        id: 'PI_XBTUSD',
        groupings: [0.5, 1, 2.5]
    },
    ['PI_ETHUSD']: {
        id: 'PI_ETHUSD',
        groupings: [0.05, 0.1, 0.25]
    }
};

export type OrderbookPriceType = {
    price: number,
    size: number
}

export type OrderbookMarketType = {
    id: string,
    groupings: number[]
}

export type OrderbookContextType = {
    market: OrderbookMarketType;
    grouping: number;
    handleChangeGrouping: Function;
    bids: OrderbookPriceType[];
    asks: OrderbookPriceType[];
    depth: number;
}

export const initialOrderbookContext: OrderbookContextType = {
    market: markets.PI_XBTUSD,
    grouping: markets.PI_XBTUSD.groupings[0],
    handleChangeGrouping: () => { throw 'handleChangeGrouping Function not yet implemented in OrderbookContext.' },
    bids: [],
    asks: [],
    depth: 0,
}

export default React.createContext<OrderbookContextType>(initialOrderbookContext);