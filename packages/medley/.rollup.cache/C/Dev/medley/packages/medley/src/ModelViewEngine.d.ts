import { CompositionRepository } from "./CompositionRepository";
export declare class ModelViewEngine {
    private viewEngine;
    constructor(compositionRepo: CompositionRepository);
    renderModel<T>(modelId: string, args: any[]): Promise<T>;
}
