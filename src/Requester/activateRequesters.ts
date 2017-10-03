import { Requester } from "cote";
import { getClassName } from "../getClassName";
import { getRequesters } from "./Requester";

export function activateRequesters(instance: any) {
  const requesters: {
    [propertyKey: string]: Requester,
  } = {};

  for (const propertyKey of getRequesters(instance)) {
    const constructor = Reflect.getMetadata("design:type", instance, propertyKey);
    const key = getClassName(constructor);

    const requester = new Requester({
      key,
      name: `Requester--${key}`,
    });

    (instance as any)[propertyKey] = new Proxy({}, {
      get: (_: any, methodName: string) => {
        return (payload: any) => {
          const action = {
            payload,
            type: methodName,
          };

          return requester.send(action);
        };
      },
    });

    requesters[propertyKey] = requester;
  }

  return requesters;
}
