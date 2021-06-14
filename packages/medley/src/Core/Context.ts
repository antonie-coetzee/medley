import { TypedModel } from ".";

export type Context = {
  medley: {
    model: TypedModel;
    getModelValue: <T extends {}>() => (T | undefined);
    getViewFunction: <T extends Function>(modelId:string, context?:{})=>Promise<T>;
    callStack: string[];
  }
};



