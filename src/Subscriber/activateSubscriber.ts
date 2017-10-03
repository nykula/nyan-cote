import { Subscriber } from "cote";
import { getClassName } from "../getClassName";
import { IAction } from "../IAction";
import { getEventHandlers } from "./EventHandler";

export function activateSubscriber(instance: any) {
  let subscriber: Subscriber | undefined;
  const key = getClassName(instance.constructor);

  for (const propertyKey of getEventHandlers(instance)) {
    if (!subscriber) {
      subscriber = new Subscriber({
        key,
        name: `${key}-subscriber`,
      });
    }

    subscriber.on(propertyKey, (req: IAction<any[]>) => {
      (instance as any)[propertyKey](...req.payload);
    });
  }

  return subscriber;
}
