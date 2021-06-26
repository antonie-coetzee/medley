import { TypedModel } from "./core";
import { Medley } from "./Medley";

export type Context = {
  medley: Medley & {
    model: TypedModel;
    getModelValue: <T extends {}>() => T | undefined;
    callStack: string[];
  };
};
