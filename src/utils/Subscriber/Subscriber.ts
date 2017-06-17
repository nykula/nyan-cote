import * as cote from "cote";
import { getClassName } from "../getClassName";
import { activateEventHandler, getEventHandlers } from "./EventHandler";

/**
 * Creates a cote subscriber for a class decorated with `@Subscriber()`, and a
 * listener for every its method decorated with `@EventHandler()`.
 */
export function Subscriber() {
  return <T extends { new (...args: any[]): {} }>(constructor: T) => {
    return class extends constructor {
      public static displayName = getClassName(constructor);

      public subscriber = new cote.Subscriber({
        key: getClassName(constructor),
        name: `Subscriber--${getClassName(constructor)}`,
      });

      constructor(...props: any[]) {
        super(...props);

        for (const propertyKey of getEventHandlers(this)) {
          activateEventHandler(this, propertyKey);
        }
      }
    };
  };
}
