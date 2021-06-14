import { Context, Type, TypedModel } from "./core";

export class ViewEngine {
  constructor(
    private getModel: (modelId: string) => Promise<TypedModel>,
    private getViewFunctionFromType: (typeId: string) => Promise<Function>
  ) {}

  public async getViewFunction<T extends Function>(
    modelId: string,
    context?: {}
  ): Promise<T> {
    if (!modelId) throw new Error("modelId is null or empty");

    const getModel = this.getModel;
    const createContext = this.createContext;
    const getBoundViewFunction = this.getBoundViewFunction.bind(this);

    const getViewFunction = async function <P extends Function>(
      this: Context | undefined,
      modelId: string,
      context?: {}
    ): Promise<P> {
      const model = await getModel(modelId);
      const cntx = createContext(
        model,
        getViewFunction,
        this, // parentContext
        context // optional context object to be merged with parent
      );
      // retrieve viewFunction from type module, bind it to the created context
      const boundViewFunction = await getBoundViewFunction(model.typeId, cntx);
      return boundViewFunction as P;
    };

    const boundViewFunction = await getViewFunction.call(
      undefined,
      modelId,
      context
    );
    return boundViewFunction as T;
  }

  private createContext(
    model: TypedModel,
    getViewFunction: <T extends Function>(
      modelId: string,
      context?: {}
    ) => Promise<T>,
    parentContext?: Context,
    context?: {}
  ): Context {

    const callStack = parentContext == null ? [model.id] : parentContext?.medley.callStack.concat(model.id);
    const cntx: Context = {
      ...parentContext,
      ...context,
      medley: {
        model,
        getModelValue: <P>() => {
          return model.value as P;
        },
        getViewFunction: getViewFunction, // chicken
        callStack
      },
    };
    cntx.medley.getViewFunction = getViewFunction.bind(cntx); // or egg
    return cntx;
  }

  private async getBoundViewFunction(
    typeId: string,
    context: Context
  ): Promise<Function> {
    const viewFunction = await this.getViewFunctionFromType(typeId);
    if (typeof viewFunction !== "function")
      throw new Error(`viewFunction is not a function for type: ${typeId}`);
    return viewFunction.bind(context);
  }
}
