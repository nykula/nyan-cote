import { Responder } from "cote";
import { getClassName } from "../getClassName";
import { IAction } from "../IAction";
import { getRequestHandlers } from "./RequestHandler";

export function activateResponder(instance: any) {
  let responder: Responder | undefined;
  const key = getClassName(instance.constructor);

  for (const propertyKey of getRequestHandlers(instance)) {
    if (!responder) {
      responder = new Responder({
        key,
        name: `${key}-responder`,
      });
    }

    responder.on(propertyKey, async (req: IAction<any[]>): Promise<IAction<{}>> => {
      let error: Error | undefined;
      let result: any;

      try {
        result = await (instance as any)[propertyKey](...req.payload);
      } catch (_) {
        error = _;
      }

      if (error) {
        error = {
          ...error,
          message: error.message,
          name: error.name,
          stack: error.stack,
        };

        return {
          error: true,
          payload: error,
          type: propertyKey,
        };
      }

      return {
        payload: result,
        type: propertyKey,
      };
    });
  }

  return responder;
}
