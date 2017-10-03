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
    void descriptor; // Type check; value is not used.
    MetadataArray.push(EVENT_HANDLERS, target, propertyKey);
  };
}

export function getEventHandlers(instance: any) {
  return MetadataArray.get(EVENT_HANDLERS, instance);
}
