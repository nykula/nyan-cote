import { Rate } from "../domain/entities/Rate";
import { RequestHandler } from "../utils/Responder/RequestHandler";
import { Responder } from "../utils/Responder/Responder";
import { ArbitrationSubscriber } from "./ArbitrationSubscriber";

@Responder()
export class ConversionService {
  public log = console.log;

  public rates: {
    [key: string]: number,
  } = {
    eurUsd: 1.10,
    usdEur: 0.91,
  };

  public subscriber = new ArbitrationSubscriber();

  constructor() {
    // Wait for injection.
    setTimeout(() => {
      this.subscriber.onUpdateRate = this.updateRate;
    });
  }

  @RequestHandler()
  public async convert({ amount, from, to }: {
    amount: number,
    from: string,
    to: string,
  }) {
    to = to[0].toUpperCase() + to.slice(1);
    return amount * this.rates[`${from}${to}`];
  }

  public updateRate = ({ currencies, rate }: Rate) => {
    this.log({ currencies, rate });
    this.rates[currencies] = rate;
  }
}
