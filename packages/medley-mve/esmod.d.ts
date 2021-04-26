export interface CompositionRepositoryOptions {
    modelRepository?: ModelRepository;
    typeRepository?: TypeRepository;
}
export declare class CompositionRepository {
    modelRepository: ModelRepository;
    typeRepository: TypeRepository;
    constructor(options?: CompositionRepositoryOptions);
    load(composition: Composition, url?: URL): Promise<void>;
    loadFromUrl(url: URL): Promise<void>;
    get composition(): Composition;
}
export interface Typed {
    typeId: string;
}
export interface ModelRepositoryOptions {
    typedModelLoadHook?: (typedModel: TypedModel) => TypedModel;
    modelsOfTypeLoadHook?: (modelsofType: ModelsOfType) => ModelsOfType;
}
export declare class ModelRepository {
    modelsById: Map<string, TypedModel>;
    private typedModelLoadHook;
    modelsByTypeId: Map<string, ModelsOfType>;
    private modelsOfTypeLoadHook;
    constructor();
    updateOptions(options?: ModelRepositoryOptions): void;
    load(modelsByType: ModelsOfType[]): Promise<void>;
    getModelById(id: string): Promise<TypedModel>;
    getModelsByTypeId(typeId: string): ModelsOfType | undefined;
    upsertModel(model: Partial<TypedModel>): Promise<void>;
    deleteModelById(id: string): Promise<void>;
}
export interface ModelsOfType {
    typeId: string;
    models: Model[];
}
export interface Model {
    id: string;
    name?: string;
    references?: string[];
    value?: any;
}
export interface TypedModel extends Model, Typed {
}
export interface Composition {
    types: URL | TypeTree;
    modelsByType: ModelsOfType[];
}
export declare class ModelViewEngine {
    private viewEngine;
    constructor(compositionRepo: CompositionRepository);
    renderModel<T>(modelId: string, args: any[]): Promise<T>;
}
export interface TypeRepositoryOptions {
    onResolvedTypeTreeUpdate?: (typeTree: TypeTree) => void;
    onTypeTreeUpdate?: (typeTree: TypeTree) => void;
    onTypesUrlUpdate?: (typesUrl: URL) => void;
}
export declare class TypeRepository {
    private typeVersionMap;
    private onResolvedTypeTreeUpdate;
    private onTypeTreeUpdate;
    private onTypesUrlUpdate;
    typesUrl: URL | undefined;
    resolvedTypeTree: TypeTree | undefined;
    typeTree: TypeTree | undefined;
    constructor(options?: TypeRepositoryOptions);
    updateOptions(options?: TypeRepositoryOptions): void;
    loadFromUrl(url: URL): Promise<void>;
    load(typeTree: TypeTree): Promise<void>;
    versionToType(versionId: string): Type | undefined;
    getViewFunction(typeVersionId: string): Promise<ViewFunction>;
    private resolveTypeTree;
    private indexType;
    loadGroup(url: URL): Promise<TypeTree>;
    private loadType;
}
export interface ModuleExport {
    url: URL;
    name?: string;
}
export interface TypeVersion {
    number: string;
    id: string;
    viewFunction: ModuleExport;
    editUrl?: URL;
    schema?: {
        input?: URL;
        output?: URL;
    };
    migration?: {
        up: ModuleExport;
        down: ModuleExport;
    };
}
export interface Type {
    name: string;
    iconUrl?: URL;
    versions: TypeVersion[];
}
export interface TypeTree {
    name: string;
    iconUrl?: URL;
    types: (URL | Type)[];
    groups?: (URL | TypeTree)[];
}
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
