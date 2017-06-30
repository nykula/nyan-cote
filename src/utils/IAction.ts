import { Event } from "cote";

export interface IAction<T> extends Event {
  payload: T;
}
