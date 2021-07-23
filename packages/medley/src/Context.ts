import { Logger, TypedModel } from "./core";
import { Medley } from "./Medley";

export type Context = {
  medley: Medley & {
    logger: Logger;
    model: TypedModel;
    getModelValue: <T extends {}>() => T | undefined;
    callStack: string[];
  };
};
