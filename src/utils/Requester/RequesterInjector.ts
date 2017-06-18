import * as cote from "cote";
import { getClassName } from "../getClassName";
import { activateRequester, getRequesters } from "./Requester";

/**
 * Injects a requester into a class decorated with `@RequesterInjector()` for
 * every its property decorated with `@Requester()`.
 */
export function RequesterInjector() {
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
