import { TypedModel } from ".";

export type Context = {
  model: TypedModel;
  viewEngine: {
    setContext: (ctx: any) => void;
    renderModel: <T>(modelId: string, ...args: []) => Promise<T | undefined>;
  };
};
