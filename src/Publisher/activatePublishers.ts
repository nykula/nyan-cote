import { Publisher } from "cote";
import { getClassName } from "../getClassName";
import { getPublishers } from "./Publisher";

export function activatePublishers(instance: any) {
  const publishers: {
    [propertyKey: string]: Publisher,
  } = {};

  for (const propertyKey of getPublishers(instance)) {
    const constructor = Reflect.getMetadata("design:type", instance, propertyKey);
    const key = getClassName(constructor);

    const publisher = new Publisher({
      key,
      name: `${getClassName(instance.constructor)}-publisher--${key}`,
    });

    (instance as any)[propertyKey] = new Proxy({}, {
      get: (_: any, methodName: string) => {
        return (payload: any) => {
          const action = {
            payload,
            type: methodName,
          };

          publisher.publish(action.type, action);
        };
      },
    });

    publishers[propertyKey] = publisher;
  }

  return publishers;
}
