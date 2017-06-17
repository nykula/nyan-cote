import * as cote from "cote";
import { getClassName } from "../getClassName";
import { activateRequestHandler, getRequestHandlers } from "./RequestHandler";

/**
 * Creates a responder for a class decorated with `@Responder()`, and a
 * listener for every its async method decorated with `@RequestHandler()`.
 */
export function Responder() {
  return <T extends { new (...args: any[]): {} }>(constructor: T) => {
    return class extends constructor {
      public static displayName = getClassName(constructor);

      public responder = new cote.Responder({
        key: getClassName(constructor),
        name: `Responder--${getClassName(constructor)}`,
      });

      constructor(...props: any[]) {
        super(...props);

        for (const propertyKey of getRequestHandlers(this)) {
          activateRequestHandler(this, propertyKey);
        }
      }
    };
  };
}
