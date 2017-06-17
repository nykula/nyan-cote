import { Rate } from "../domain/entities/Rate";
import { EventHandler } from "../utils/Subscriber/EventHandler";
import { Subscriber } from "../utils/Subscriber/Subscriber";

@Subscriber()
export class ArbitrationSubscriber {
  public onUpdateRate: (rate: Rate) => void;

  @EventHandler()
  public updateRate(rate: Rate) {
    this.onUpdateRate(rate);
  }
}
