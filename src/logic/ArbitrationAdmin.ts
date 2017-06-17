import { Requester } from "../utils/Requester/Requester";
import { ResponderInjector } from "../utils/Requester/ResponderInjector";
import { ArbitrationService } from "./ArbitrationService";

@ResponderInjector()
export class ArbitrationAdmin {
  @Requester()
  public arbitrationService: ArbitrationService;

  constructor() {
    setInterval(() => {
      this.updateRate();
    }, 1000);
  }

  public updateRate() {
    const rate = Math.random();

    this.arbitrationService.updateRate({
      currencies: "usdEur",
      rate,
    });
  }
}
