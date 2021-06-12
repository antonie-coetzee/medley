import { Context, TypedModel, ViewFunction } from "./core";

export class ViewEngine {
  constructor(
    private getModel: (modelId: string) => Promise<TypedModel>,
    private getViewFunctionFromType: (typeId: string) => Promise<ViewFunction>
  ) {
    this.getViewFunction = this.getViewFunction.bind(this);
  }

  public async getViewFunction<T extends Function>(modelId:string, context?:{}):Promise<T>{
    if (!modelId) throw new Error("modelId is null or empty");

    const model = await this.getModel(modelId);
    const cntx: Context = {
      ...context,
      medley:{
        model,
        getModelValue: <P>() => {
          return model.value as P;
        },
        getViewFunction: this.getViewFunction,
      }
    };
    
    const viewFunction = await this.getViewFunctionFromType(model.typeId) as Function;
    if(typeof viewFunction !== "function") throw new Error("viewFunction is not a function");
    const boundViewFunction = viewFunction.bind(cntx);
    return boundViewFunction as T;
  }  
}
