import { Context, TypedModel, ViewFunction } from "./core";

export class ViewEngine {
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

  public async renderModel(
    modelId: string,
    ...args: any[]
  ): Promise<any | undefined> {
    if (!modelId) throw new Error("modelId is null or empty");

    const oldContext = this.context;

    const viewEngine = {
      renderModel: this.renderModel,
      setContext: this.setContext,
    };

    const model = await this.getModel(modelId);
    const context: Context = {
      ...this.context,
      model,
      getModelValue: () => {
        return model.value;
      },
      viewEngine,
    };

    const viewFunction = await this.getViewFunction(model.typeId);

    try {
      return viewFunction.call(context, ...args);
    } finally {
      this.context = oldContext;
    }
  }
}
