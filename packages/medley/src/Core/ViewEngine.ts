import { Typed } from "./Typed";

export type ViewFunction = (cntx: any, ...args: any[]) => Promise<any>;

export class ViewEngine {
  private context: any = {};

  getContext(): any {
    return this.context;
  }

  setContext(context: any): void {
    this.context = context;
  }

  constructor(
    private getModel: (modelId: string) => Promise<Typed>,
    private getViewFunction: (typeId: string) => Promise<ViewFunction>
  ) {
    this.setContext = this.setContext.bind(this);
    this.renderModel = this.renderModel.bind(this);
  }

  public async renderModel<T>(modelId: string, ...args: any[]): Promise<T> {
    if (!modelId) throw new Error("modelId is null or empty");

    const oldContext = this.context;

    const viewEngine = {
      renderModel: this.renderModel,
      setContext: this.setContext,
    };

    const model = await this.getModel(modelId);
    const cntx = {
      ...this.context,
      model,
      viewEngine,
    };

    const viewFunction = await this.getViewFunction(model.typeId);
    
    try {
      return await viewFunction(cntx, ...args);
    } finally {
      this.context = oldContext;
    }
  }
}
