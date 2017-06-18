// tslint:disable:max-classes-per-file

declare module "cote" {
    /**
     * Flux standard action.
     */
    export interface IAction {
        type: string;

        payload?: any;
    }

    export interface IProps {
        key: string;

        name: string;
    }

    export class Publisher {
        constructor(props: IProps)

        public publish(action: IAction): void;
    }

    export class Requester {
        constructor(props: IProps)

        public send(action: IAction): Promise<any>;
    }

    export class Responder {
        constructor(props: IProps)

        public on(
            type: string,
            onRequest: (action: IAction) => Promise<any>,
        ): void;
    }

    export class Subscriber {
        constructor(props: IProps)

        public on(
            type: string,
            onEvent: (action: IAction) => void,
        ): void;
    }
}
