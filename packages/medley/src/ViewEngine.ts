import { Medley } from "./Medley";
import { TypedModel } from "./core";
import { Context } from "./Context";

export type ReturnedPromiseType<T> = T extends (...args: any[]) => Promise<infer R> ? R : never;

export class ViewEngine {
  constructor(
    private medley: Medley,
    private getModel: (modelId: string) => TypedModel,
    private getViewFunctionFromType: (typeId: string) => Promise<Function>
  ) {}

  public async getViewFunction<T extends Function>(
    modelId: string,
    context?: {}
  ): Promise<T> {
    if (!modelId) throw new Error("modelId is null or empty");

    // use closure to capture viewengine on initial invocation
    const viewEngine = this;
    const getViewFunction = async function (this: Context | void) {
      const viewFuction = await ViewEngine.buildViewFunction(
        viewEngine,
        modelId,
        this,
        context
      );
      return viewFuction;
    };

    const viewFunction = await getViewFunction();
    return viewFunction as T;
  }

  public runViewFunction = async <T extends (...args: any) => any>(
    target: string | { modelId: string; context: {} },
    ...args: Parameters<T>
  ): Promise<ReturnedPromiseType<T>> => {
    let modelId: string;
    let context: {} | undefined;
    if (typeof target === "string") {
      modelId = target;
    } else {
      modelId = target.modelId;
      context = target.context;
    }
    // use closure to capture viewengine on initial invocation
    const viewEngine = this;
    const getViewFunction = async function (this: Context | void) {
      const viewFuction = await ViewEngine.buildViewFunction(
        viewEngine,
        modelId,
        this,
        context
      );
      return viewFuction;
    };
    const viewFunction = await getViewFunction();
    return viewFunction(args);
  };

  private static async buildViewFunction(
    viewEngine: ViewEngine,
    modelId: string,
    parentContext: Context | void,
    context: {} | undefined
  ) {
    const getViewFunction = async function <P extends Function>(
      this: Context | undefined,
      modelId: string,
      context?: {}
    ): Promise<P> {
      const viewFuction = await ViewEngine.buildViewFunction(
        viewEngine,
        modelId,
        this,
        context
      );
      return viewFuction as P;
    };

    const runViewFunction = async function <P extends (...args: any) => any>(
      this: Context | undefined,
      target: string | { modelId: string; context: {} },
      ...args: Parameters<P>
    ): Promise<ReturnedPromiseType<P>> {
      let modelId: string;
      let runContext: {} | undefined;
      if (typeof target === "string") {
        modelId = target;
      } else {
        modelId = target.modelId;
        runContext = target.context;
      }
      const viewFuction = await ViewEngine.buildViewFunction(
        viewEngine,
        modelId,
        this,
        runContext
      );
      return viewFuction(args);
    };
    // parentContext can be void
    let callstack: string[] | undefined = [];
    if (parentContext) {
      callstack = parentContext.medley?.callStack || undefined;
    }
    viewEngine.checkForCircularReference(callstack, modelId);
    const model = viewEngine.getModel(modelId);
    const cntx = viewEngine.createContext(
      model,
      getViewFunction,
      runViewFunction,
      viewEngine.medley,
      parentContext,
      context
    );
    const boundViewFunction = await viewEngine.getBoundViewFunction(
      model.typeName,
      cntx
    );
    return boundViewFunction;
  }

  private createContext(
    model: TypedModel,
    getViewFunction: <T extends Function>(
      modelId: string,
      context?: {}
    ) => Promise<T>,
    runViewFunction: <T extends (...args: any) => any>(
      target: string | { modelId: string; context: {} },
      ...args: Parameters<T>
    ) => Promise<ReturnedPromiseType<T>>,
    medley: Medley,
    parentContext?: Context | void,
    context?: {}
  ): Context {
    const callStack =
      parentContext == null
        ? [model.id]
        : parentContext?.medley.callStack.concat(model.id);
    const medleyContext = Object.assign({}, medley, {
      model,
      getModelValue: <P>() => {
        return model.value as P;
      },
      callStack,
    });
    const cntx: Context = {
      ...parentContext,
      ...context,
      medley: medleyContext,
    };
    cntx.medley.getViewFunction = getViewFunction.bind(cntx);
    cntx.medley.runViewFunction = runViewFunction.bind(cntx);
    return cntx;
  }

  private getBoundViewFunction = async (
    typeId: string,
    context: Context
  ): Promise<Function> => {
    const viewFunction = await this.getViewFunctionFromType(typeId);
    if (typeof viewFunction !== "function")
      throw new Error(`viewFunction is not a function for type: ${typeId}`);
    return viewFunction.bind(context);
  };

  private checkForCircularReference(
    callStack: string[] | undefined,
    modelId: string
  ) {
    if (callStack == null) return;

    if (callStack.findIndex((el) => el === modelId) > -1) {
      throw new Error(`circular reference detected with modelId: '${modelId}'`);
    }
  }
}
