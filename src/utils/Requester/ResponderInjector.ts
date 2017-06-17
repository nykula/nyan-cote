import * as cote from "cote";
import { getClassName } from "../getClassName";
import { activateRequester, getRequesters } from "./Requester";

/**
 * Injects a responder into a class decorated with `@ResponderInjector()` for
 * every its property decorated with `@Requester()`.
 */
export function ResponderInjector() {
  return <T extends { new (...args: any[]): {} }>(constructor: T) => {
    return class extends constructor {
      public static displayName = getClassName(constructor);

      constructor(...props: any[]) {
        super(...props);

        for (const propertyKey of getRequesters(this)) {
          activateRequester(this, propertyKey);
        }
      }
    };
  };
}
