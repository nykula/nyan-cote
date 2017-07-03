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

export function getRequesters(instance: any) {
  return MetadataArray.get(REQUESTERS, instance);
}
