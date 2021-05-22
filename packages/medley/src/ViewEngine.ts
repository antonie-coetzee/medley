import { Context, TypedModel, ViewFunction } from "./core";

export class ViewEngine {
  private viewFunctionCache: Map<string, ViewFunction> = new Map();
  private context: any = {};

  getContext(): any {
    return this.context;
  }

  setContext(context: any): void {
    this.context = context;
  }

  constructor(
    private getModel: (modelId: string) => Promise<TypedModel>,
    private getViewFunction: (typeId: string) => Promise<ViewFunction>
  ) {
    this.setContext = this.setContext.bind(this);
    this.renderModel = this.renderModel.bind(this);
  }

  public clearCache(){
    this.viewFunctionCache = new Map();
  }

  public async renderModel<T>(modelId: string, ...args: any[]): Promise<T> {
    if (!modelId) throw new Error("modelId is null or empty");

    const oldContext = this.context;

    const viewEngine = {
      renderModel: this.renderModel,
      setContext: this.setContext,
    };

    const model = await this.getModel(modelId);
    const cntx: Context = {
      ...this.context,
      model,
      viewEngine,
    };

    const viewFunction =
      this.viewFunctionCache.get(model.typeId) ||
      (await this.getViewFunction(model.typeId));

    try {
      return viewFunction(cntx, ...args);
    } finally {
      this.context = oldContext;
    }
  }
}
