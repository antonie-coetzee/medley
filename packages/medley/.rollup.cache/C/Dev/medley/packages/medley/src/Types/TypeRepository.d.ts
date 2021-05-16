import { ViewFunction } from "../Core/index";
import { Type, TypeTree } from "./Type";
export interface TypeRepositoryOptions {
    onResolvedTypeTreeUpdate?: (typeTree: TypeTree) => void;
    onTypeTreeUpdate?: (typeTree: TypeTree) => void;
    onTypesUrlUpdate?: (typesUrl: URL) => void;
    import?: (url: string) => Promise<any>;
}
export declare class TypeRepository {
    private typeVersionMap;
    private onResolvedTypeTreeUpdate;
    private onTypeTreeUpdate;
    private onTypesUrlUpdate;
    private import;
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
