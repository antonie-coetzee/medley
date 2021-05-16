import { ModelsOfType, TypedModel } from "./Model";
export interface ModelRepositoryOptions {
    typedModelLoadHook?: (typedModel: TypedModel) => TypedModel;
    modelsOfTypeLoadHook?: (modelsofType: ModelsOfType) => ModelsOfType;
}
export declare class ModelRepository {
    modelsById: Map<string, TypedModel>;
    private typedModelLoadHook;
    modelsByTypeId: Map<string, ModelsOfType>;
    private modelsOfTypeLoadHook;
    constructor(options?: ModelRepositoryOptions);
    updateOptions(options?: ModelRepositoryOptions): void;
    load(modelsByType: ModelsOfType[]): Promise<void>;
    getModelById(id: string): Promise<TypedModel>;
    getModelsByTypeId(typeId: string): ModelsOfType | undefined;
    upsertModel(model: Partial<TypedModel>): Promise<void>;
    deleteModelById(id: string): Promise<void>;
}
