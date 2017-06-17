// tslint:disable:max-classes-per-file

declare module "cote" {
    export interface IProps {
        key: string;
        name: string;
    }

    export class Publisher {
        constructor({ key, name }: IProps)

        public publish({ type }: { type: string }): void;
    }

    export class Requester {
        constructor({ key, name }: IProps)

        public send({ type }: { type: string }): Promise<any>;
    }

    export class Responder {
        constructor({ key, name }: IProps)

        public on(
            type: string,
            onRequest: (data: any) => Promise<any>,
        ): void;
    }

    export class Subscriber {
        constructor({ key, name }: IProps)

        public on(
            type: string,
            onEvent: (data: any) => void,
        ): void;
    }
}
