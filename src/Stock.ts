import { immerable } from "immer";

export class Stock {
  [immerable] = true;

  constructor(
    public ticker: string,
    public name: string,
    public priceHistory: number[]
  ) {}

  get price() {
    if (this.priceHistory.length < 1) return 0;
    return this.priceHistory[this.priceHistory.length - 1];
  }

  pushPrice(price) {
    this.priceHistory.push(price);
    return this;
  }
}
