import * as cote from "cote";

/**
 * Creates a cote responder with same name as the class, and a cote listener
 * for every method. Use it as a class decorator: `@Responder()`.
 */
export function Responder() {
    return <T extends { new (...args: any[]): {} }>(constructor: T) => {
        return class extends constructor {
            public responder = new cote.Responder({ name: constructor.name });

            constructor(...props: any[]) {
                super(...props);

                for (const propertyKey in this) {
                    if (propertyKey === "constructor") {
                        continue;
                    }

                    const property = (this as any)[propertyKey];

                    if (typeof property !== "function") {
                        continue;
                    }

                    this.responder.on(propertyKey, async (req, cb) => {
                        const result: any = await property(req);
                        cb(result);
                    });
                }
            }
        };
    };
}
