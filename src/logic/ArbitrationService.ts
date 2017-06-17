import { Publisher } from "../utils/Publisher/Publisher";
import { SubscriberInjector } from "../utils/Publisher/SubscriberInjector";
import { RequestHandler } from "../utils/Responder/RequestHandler";
import { Responder } from "../utils/Responder/Responder";
import { ArbitrationSubscriber } from "./ArbitrationSubscriber";

@Responder()
@SubscriberInjector()
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
