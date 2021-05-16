import { Composition } from "./Composition";
import { ModelRepository } from "./Models";
import { TypeRepository } from "./Types";
export interface CompositionRepositoryOptions {
    modelRepository?: ModelRepository;
    typeRepository?: TypeRepository;
    import?: (url: string) => Promise<any>;
}
export declare class CompositionRepository {
    private import;
    modelRepository: ModelRepository;
    typeRepository: TypeRepository;
    constructor(options?: CompositionRepositoryOptions);
    load(composition: Composition, url?: URL): Promise<void>;
    loadFromUrl(url: URL): Promise<void>;
    get composition(): Composition;
}
