import { Nyan } from "../utils/Nyan";
import { Requester } from "../utils/Requester/Requester";
import { ArbitrationService } from "./ArbitrationService";

export class ArbitrationAdmin {
  @Requester()
  public arbitrationService: ArbitrationService;

  public nyan = new Nyan(this);

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
