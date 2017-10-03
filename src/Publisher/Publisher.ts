import "reflect-metadata";
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

export function getPublishers(instance: any) {
  return MetadataArray.get(PUBLISHERS, instance);
}
