import { Event } from "cote";

export interface IAction<T> extends Event {
  error?: boolean;

  payload: T;
}
