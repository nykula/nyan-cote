import * as cote from "cote";
import "reflect-metadata";
import { getClassName } from "../getClassName";
import { MetadataArray } from "../MetadataArray";

export const REQUESTERS = Symbol("REQUESTERS");

/**
 * Sends a cote request when you call an instance method. Use it as a property
 * decorator in a class decorated with `@ResponderInjector()`.
 */
export function Requester() {
  return (target: any, propertyKey: string) => {
    MetadataArray.push(REQUESTERS, target, propertyKey);
  };
}

export function activateRequester(instance: any, propertyKey: string) {
  const constructor = Reflect.getMetadata("design:type", instance, propertyKey);

  const requester = new cote.Requester({
    key: getClassName(constructor),
    name: `Requester--${getClassName(constructor)}`,
  });

  instance[propertyKey] = new Proxy({}, {
    get: (x: any, name: string) => {
      return (payload: any) => {
        const action = {
          payload,
          type: name,
        };

        return requester.send(action);
      };
    },
  });
}

export function getRequesters(instance: any) {
  return MetadataArray.get(REQUESTERS, instance);
}
