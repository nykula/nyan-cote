// tslint:disable:max-classes-per-file

declare module "cote" {
    export class Requester {
        constructor({ name }: { name: string })

        public send(
            { type }: { type: string },
            onResponse: (response: any) => void,
        ): void;
    }

    export class Responder {
        constructor({ name }: { name: string })

        public on(
            type: string,
            onRequest: (data: any, callback: (response: any) => void) => void,
        ): void;
    }
}
