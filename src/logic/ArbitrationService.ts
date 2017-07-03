import { Nyan } from "../utils/Nyan";
import { Publisher } from "../utils/Publisher/Publisher";
import { RequestHandler } from "../utils/Responder/RequestHandler";
import { ConversionService } from "./ConversionService";

export class ArbitrationService {
  public rates: { [key: string]: number } = {};

  @Publisher()
  public conversionService: ConversionService;

  public nyan = new Nyan(this);

  @RequestHandler()
  public async updateRate({ currencies, rate }: {
    currencies: string,
    rate: number,
  }) {
    this.rates[currencies] = rate;
    this.conversionService.updateRate({ currencies, rate });
    return "OK!";
  }
}
