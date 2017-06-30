import * as cote from "cote";
import { IAction } from "../IAction";
import { MetadataArray } from "../MetadataArray";

export const EVENT_HANDLERS = Symbol("EVENT_HANDLERS");

/**
 * Adds a listener to a cote subscriber.
 */
export function EventHandler() {
  return (
    target: any,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<(...args: any[]) => void>,
  ) => {
    MetadataArray.push(EVENT_HANDLERS, target, propertyKey);
  };
}

export function activateEventHandler(instance: any, propertyKey: string) {
  const subscriber: cote.Subscriber = instance.subscriber;

  subscriber.on(propertyKey, (req: IAction<{}>) => {
    instance[propertyKey](req.payload);
  });
}

export function getEventHandlers(instance: any) {
  return MetadataArray.get(EVENT_HANDLERS, instance);
}
