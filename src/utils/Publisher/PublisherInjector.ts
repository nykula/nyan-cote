import * as cote from "cote";
import { getClassName } from "../getClassName";
import { activatePublisher, getPublishers } from "./Publisher";

/**
 * Injects a publisher into a class decorated with `@PublisherInjector()` for
 * every its property decorated with `@Publisher()`.
 */
export function PublisherInjector() {
  return <T extends { new (...args: any[]): {} }>(constructor: T) => {
    return class extends constructor {
      public static displayName = getClassName(constructor);

      constructor(...props: any[]) {
        super(...props);

        for (const propertyKey of getPublishers(this)) {
          activatePublisher(this, propertyKey);
        }
      }
    };
  };
}
