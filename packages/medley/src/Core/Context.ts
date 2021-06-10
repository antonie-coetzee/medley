import { TypedModel } from ".";

export type Context = {
  model: TypedModel;
  getModelValue: <T extends {}>() => (T | undefined);
  viewEngine: {
    setContext: (ctx: any) => void;
    renderModel: <T>(modelId: string, ...args: any[]) => Promise<T | undefined>;
  };
};
