import { Nyan } from "../utils/Nyan";
import { Requester } from "../utils/Requester/Requester";
import { ConversionService } from "./ConversionService";

export class ConversionClient {
  @Requester()
  public conversionService: ConversionService;

  public log = console.log;

  public nyan = new Nyan(this);

  constructor() {
    (async () => {
      let rate = 0;

      try {
        rate = await this.conversionService.convert({
          amount: 100,
          from: "usd",
          to: "eur",
        });
      } catch (error) {
        this.log(error.name, error.message, error.status, error.stack);
        return;
      }

      this.log(rate);
    })();
  }
}
