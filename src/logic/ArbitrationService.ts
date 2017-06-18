import { Publisher } from "../utils/Publisher/Publisher";
import { PublisherInjector } from "../utils/Publisher/PublisherInjector";
import { RequestHandler } from "../utils/Responder/RequestHandler";
import { Responder } from "../utils/Responder/Responder";
import { ArbitrationSubscriber } from "./ArbitrationSubscriber";

@Responder()
@PublisherInjector()
export class ArbitrationService {
  public rates: { [key: string]: number } = {};

  @Publisher()
  public arbitrationSubscriber: ArbitrationSubscriber;

  @RequestHandler()
  public async updateRate({ currencies, rate }: {
    currencies: string,
    rate: number,
  }) {
    this.rates[currencies] = rate;
    this.arbitrationSubscriber.updateRate({ currencies, rate });
    return "OK!";
  }
}
