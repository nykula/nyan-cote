import { Responder } from "cote";
import { getClassName } from "../getClassName";
import { IAction } from "../IAction";
import { getRequestHandlers } from "./RequestHandler";

export function activateResponder(instance: any) {
  let responder: Responder = null;
  const key = getClassName(instance.constructor);

  for (const propertyKey of getRequestHandlers(instance)) {
    if (!responder) {
      responder = new Responder({
        key,
        name: `Responder--${key}`,
      });
    }

    responder.on(propertyKey, (req: IAction<{}>) => {
      return (instance as any)[propertyKey](req.payload);
    });
  }

  return responder;
}
