import React from "react";

export type OrderbookPricetype = {
    price: number,
    size: number,
    depth: number
}

export type OrderbookContextType = {
    product: string;
    bids: OrderbookPricetype[];
    asks: OrderbookPricetype[];
}

export const initialOrderbookContext: OrderbookContextType = {
    product: '',
    bids: [],
    asks: []
}

export default React.createContext<OrderbookContextType>(initialOrderbookContext);