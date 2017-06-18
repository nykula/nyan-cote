import { Requester } from "../utils/Requester/Requester";
import { RequesterInjector } from "../utils/Requester/RequesterInjector";
import { ConversionService } from "./ConversionService";

@RequesterInjector()
export class ConversionClient {
  @Requester()
  public conversionService: ConversionService;

  public log = console.log;

  constructor() {
    // Wait for injection.
    setTimeout(async () => {
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
    });
  }
}
