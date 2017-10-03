import { MetadataArray } from "../MetadataArray";

export const REQUEST_HANDLERS = Symbol("REQUEST_HANDLERS");

/**
 * Adds a listener to a cote responder.
 */
export function RequestHandler() {
  return (
    target: any,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<any>>,
  ) => {
    void descriptor; // Type check; value is not used.
    MetadataArray.push(REQUEST_HANDLERS, target, propertyKey);
  };
}

export function getRequestHandlers(instance: any) {
  return MetadataArray.get(REQUEST_HANDLERS, instance);
}
