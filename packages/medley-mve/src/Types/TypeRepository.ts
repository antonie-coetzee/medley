import Url from "url-parse";
import { Loader, ViewFunction } from "../Core";
import { Type, TypeTree, TypeVersion } from "./Type";

export interface TypeRepositoryOptions {
  onResolvedTypeTreeUpdate?: (typeTree: TypeTree) => void;
  onTypeTreeUpdate?: (typeTree: TypeTree) => void;
  onTypesUrlUpdate?: (typesUrl: Url) => void;
}

export class TypeRepository {
  private loader:Loader;
  public typesUrl: Url;
  private typeVersionMap: Map<string, { type: Type; version: TypeVersion }>;
  private onResolvedTypeTreeUpdate: (typeTree: TypeTree) => void;
  private onTypeTreeUpdate: (typeTree: TypeTree) => void;
  private onTypesUrlUpdate: (typesUrl: Url) => void;

  public resolvedTypeTree: TypeTree;
  public typeTree: TypeTree;

  constructor(loader: Loader, options?:TypeRepositoryOptions) {
    this.loader = loader;
    this.onResolvedTypeTreeUpdate = options?.onResolvedTypeTreeUpdate || (()=>{});
    this.onTypeTreeUpdate = options?.onTypeTreeUpdate || (()=>{});
    this.onTypesUrlUpdate = options?.onTypesUrlUpdate || (()=>{});
    this.getViewFunction = this.getViewFunction.bind(this);
  }

  public async loadFromUrl(url: Url): Promise<void> {
    this.typesUrl = url;
    this.onTypesUrlUpdate(this.typesUrl);
    var module = await this.loader.import(url);
    const typeTree: TypeTree = module.default;
    return this.load(typeTree);
  }

  public async load(typeTree: TypeTree): Promise<void> {
    this.typeTree = typeTree;
    this.onTypeTreeUpdate(this.typeTree);
    this.resolvedTypeTree = {
      name: typeTree.name,
      iconUrl: typeTree.iconUrl,
      types: [],
      groups: [],
    };
    this.typeVersionMap = new Map();
    await this.resolveTypeTree(typeTree, this.resolvedTypeTree);
    this.onResolvedTypeTreeUpdate(this.resolvedTypeTree);
  }

  public versionToType(versionId: string): Type | undefined {
    const { type } = this.typeVersionMap.get(versionId) || {};
    return type;
  }

  public async getViewFunction(typeVersionId: string): Promise<ViewFunction> {
    const { type, version } = this.typeVersionMap.get(typeVersionId) || {};
    if (type === undefined || version === undefined)
      throw new Error(`type with version id: ${typeVersionId} not found`);

    const typeModuleUrl = new Url(
      version.viewFunction.url.toString(),
      this.typesUrl
    );
    if (typeModuleUrl === undefined)
      throw new Error("typeModuleUrl is undefined");

    const typeModule = await this.loader.import(typeModuleUrl);
    if (version.viewFunction.name) {
      return typeModule[version.viewFunction.name];
    } else {
      return typeModule.default;
    }
  }

  private async resolveTypeTree(
    partialTypeTree: TypeTree,
    resolvedTypeTree: TypeTree
  ): Promise<void> {
    for await (const type of partialTypeTree.types) {
      if ((type as Type).name === undefined) {
        const typeUrl = new Url(type.toString(), this.typesUrl);
        const typeLoaded = await this.loadType(typeUrl);
        resolvedTypeTree.types.push(typeLoaded);
        this.indexType(typeLoaded);
      } else {
        this.indexType(type as Type);
        resolvedTypeTree.types.push(type);
      }
    }
    if (partialTypeTree.groups !== undefined) {
      for await (const group of partialTypeTree.groups) {
        let groupTypeTree: TypeTree;
        if((group as TypeTree).name === undefined){
          const groupUrl = new Url(group.toString(), this.typesUrl);
          groupTypeTree = await this.loadGroup(groupUrl)
        }else{
          groupTypeTree = group as TypeTree;
        }
        const resolvedGroup: TypeTree = {
          name: groupTypeTree.name,
          iconUrl: groupTypeTree.iconUrl,
          types: [],
          groups: [],
        };
        resolvedTypeTree.groups?.push(resolvedGroup);
        await this.resolveTypeTree(groupTypeTree, resolvedGroup);
      }
    }
  }

  private indexType(type: Type) {
    type.versions.forEach((version) => {
      this.typeVersionMap.set(version.id, { type, version });
    });
  }

  public async loadGroup(url: Url): Promise<TypeTree> {
    var module = await this.loader.import(url);
    const typeTree: TypeTree = module.default;
    return typeTree;
  }

  private async loadType(url: Url): Promise<Type> {
    const typeModule = await this.loader.import(url);
    const type: Type = typeModule.default;
    return type;
  }
}
