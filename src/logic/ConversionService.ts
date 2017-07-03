import { Rate } from "../domain/entities/Rate";
import { EventHandler } from "../index";
import { Nyan } from "../utils/Nyan";
import { RequestHandler } from "../utils/Responder/RequestHandler";

export class ConversionService {
  public log = console.log;

  public nyan = new Nyan(this);

  public rates: {
    [key: string]: number,
  } = {
    eurUsd: 1.10,
    usdEur: 0.91,
  };

  @RequestHandler()
  public async convert({ amount, from, to }: {
    amount: number,
    from: string,
    to: string,
  }) {
    to = to[0].toUpperCase() + to.slice(1);
    return amount * this.rates[`${from}${to}`];
  }

  @EventHandler()
  public updateRate({ currencies, rate }: Rate) {
    this.log({ currencies, rate });
    this.rates[currencies] = rate;
  }
}
