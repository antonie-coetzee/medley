import { Typed } from "./Typed";
export declare type ViewFunction = (cntx: any, ...args: any[]) => Promise<any>;
export declare class ViewEngine {
    private getModel;
    private getViewFunction;
    private context;
    getContext(): {};
    setContext(context: {}): void;
    constructor(getModel: (modelId: string) => Promise<Typed>, getViewFunction: (typeId: string) => Promise<ViewFunction>);
    renderModel<T>(modelId: string, ...args: any[]): Promise<T>;
}
