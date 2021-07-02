import { OrderbookPriceType } from "../contexts/orderbookContext";

export const ascNumberArray = (a: number[], b: number[]) => {
    if (a[0] < b[0]) {
        return -1;
    }
    if (a[0] > b[0]) {
        return 1;
    }
    return 0;
};

export const descNumberArray = (a: number[], b: number[]) => {
    if (a[0] < b[0]) {
        return 1;
    }
    if (a[0] > b[0]) {
        return -1;
    }
    return 0;
};

export const ascOrderbookPrice = (a: OrderbookPriceType, b: OrderbookPriceType) => {
    if (a.price < b.price) {
        return -1;
    }
    if (a.price > b.price) {
        return 1;
    }
    return 0;
};

export const descOrderbookPrice = (a: OrderbookPriceType, b: OrderbookPriceType) => {
    if (a.price < b.price) {
        return 1;
    }
    if (a.price > b.price) {
        return -1;
    }
    return 0;
};