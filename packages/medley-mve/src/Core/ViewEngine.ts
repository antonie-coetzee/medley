import { Loader } from "./Loader";
import { Typed } from "./Typed";

export type ViewFunction = (cntx:any, ...args:any[])=>Promise<any>;

export class ViewEngine {
  private context: {} = {};

  getContext(): {} {
    return this.context;
  }

  setContext(context: {}): void {
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

    const model = await this.getModel(modelId);
    const viewFunction = await this.getViewFunction(model.typeId);
    
    let oldContext = this.context;

    let viewEngine = {
      renderModel: this.renderModel,
      setContext: this.setContext,
    };

    let cntx = {
      ...this.context,
      model,
      viewEngine,
    };

    try {
      return await viewFunction(cntx, ...args);
    } finally {
      this.context = oldContext;
    }
  }
}
