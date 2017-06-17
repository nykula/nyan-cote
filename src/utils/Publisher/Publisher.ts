import * as cote from "cote";
import "reflect-metadata";
import { getClassName } from "../getClassName";
import { MetadataArray } from "../MetadataArray";

export const PUBLISHERS = Symbol("PUBLISHERS");

/**
 * Sends a cote event when you call an instance method. Use it as a property
 * decorator in a class decorated with `@SubscriberInjector()`.
 */
export function Publisher() {
  return (target: any, propertyKey: string) => {
    MetadataArray.push(PUBLISHERS, target, propertyKey);
  };
}

export function activatePublisher(instance: any, propertyKey: string) {
  const constructor = Reflect.getMetadata("design:type", instance, propertyKey);

  const publisher = new cote.Publisher({
    key: getClassName(constructor),
    name: `Publisher--${getClassName(constructor)}`,
  });

  instance[propertyKey] = new Proxy({}, {
    get: (x: any, name: string) => {
      return (payload: any) => {
        const action = {
          payload,
          type: name,
        };

        (publisher as any).publish(action.type, action);
      };
    },
  });
}

export function getPublishers(instance: any) {
  return MetadataArray.get(PUBLISHERS, instance);
}
