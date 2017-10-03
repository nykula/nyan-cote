import { Requester } from "cote";
import { getClassName } from "../getClassName";
import { IAction } from "../IAction";
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
      name: `${getClassName(instance.constructor)}-${propertyKey}`,
    });

    (instance as any)[propertyKey] = new Proxy({}, {
      get: (_: any, methodName: string) => {
        return async (...payload: any[]) => {
          const action = {
            payload,
            type: methodName,
          };

          const result: IAction<{}> = await requester.send(action);

          if (result.error) {
            return Promise.reject(result.payload);
          }

          return result.payload;
        };
      },
    });

    requesters[propertyKey] = requester;
  }

  return requesters;
}
