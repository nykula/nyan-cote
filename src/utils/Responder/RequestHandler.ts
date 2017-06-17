import * as cote from "cote";
import { Action } from "../../domain/entities/Action";
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
    MetadataArray.push(REQUEST_HANDLERS, target, propertyKey);
  };
}

export function activateRequestHandler(instance: any, propertyKey: string) {
  const responder: cote.Responder = instance.responder;

  responder.on(propertyKey, (req: Action) => {
    return instance[propertyKey](req.payload);
  });
}

export function getRequestHandlers(instance: any) {
  return MetadataArray.get(REQUEST_HANDLERS, instance);
}
