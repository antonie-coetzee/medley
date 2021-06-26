import { Medley } from "./Medley";
import { TypedModel } from "./core";
import { Context} from "./Context";

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
    const getModel = this.getModel;
    const createContext = this.createContext;
    const getBoundViewFunction = this.getBoundViewFunction;
    const checkForCircularReference = this.checkForCircularReference;
    const medley = this.medley;

    const getViewFunction = async function <P extends Function>(
      this: Context | undefined,
      modelId: string,
      context?: {}
    ): Promise<P> {
      checkForCircularReference(this?.medley.callStack, modelId);
      const model = getModel(modelId);
      const cntx = createContext(
        model,
        getViewFunction,
        medley,
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
    medley: Medley,
    parentContext?: Context,
    context?: {}
  ): Context {
    const callStack =
      parentContext == null
        ? [model.id]
        : parentContext?.medley.callStack.concat(model.id);
    const medleyContext = Object.assign(
      {},
      medley,
      {
        model,
        getModelValue: <P>() => {
          return model.value as P;
        },
        callStack,
      }
    );
    const cntx: Context = {
      ...parentContext,
      ...context,
      medley: medleyContext,
    };
    cntx.medley.getViewFunction = getViewFunction.bind(cntx); 
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
  }

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
