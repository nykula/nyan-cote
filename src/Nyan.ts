import { Publisher, Requester, Responder, Subscriber } from "cote";
import { activatePublishers } from "./Publisher/activatePublishers";
import { activateRequesters } from "./Requester/activateRequesters";
import { activateResponder } from "./Responder/activateResponder";
import { activateSubscriber } from "./Subscriber/activateSubscriber";

export class Nyan {
  public publishers: {
    [propertyKey: string]: Publisher,
  };

  public requesters: {
    [propertyKey: string]: Requester,
  };

  public responder: Responder | undefined;

  public subscriber: Subscriber | undefined;

  constructor(instance: any) {
    this.publishers = activatePublishers(instance);

    this.requesters = activateRequesters(instance);

    this.responder = activateResponder(instance);

    this.subscriber = activateSubscriber(instance);
  }

  public close() {
    for (const propertyKey of Object.keys(this.publishers)) {
      this.publishers[propertyKey].close();
    }

    for (const propertyKey of Object.keys(this.requesters)) {
      this.requesters[propertyKey].close();
    }

    if (this.responder) {
      this.responder.close();
    }

    if (this.subscriber) {
      this.subscriber.close();
    }
  }
}
