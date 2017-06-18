import { Requester } from "../utils/Requester/Requester";
import { RequesterInjector } from "../utils/Requester/RequesterInjector";
import { ArbitrationService } from "./ArbitrationService";

@RequesterInjector()
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
