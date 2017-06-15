import * as cote from "cote";

export class Requester {
    public static client: cote.Requester;

    /**
     * Given a class, sends a cote request when you call an instance method.
     */
    public static get<T>(constructor: { new (): T }): T {
        if (!Requester.client) {
            Requester.client = new cote.Requester({ name: "Client" });
        }

        return new Proxy({}, {
            get: (target: any, name: string) => {
                return (payload: any) => {
                    return new Promise((resolve) => {
                        const action = {
                            payload,
                            type: name,
                        };

                        this.client.send(action, resolve);
                    });
                };
            },
        });
    }
}
