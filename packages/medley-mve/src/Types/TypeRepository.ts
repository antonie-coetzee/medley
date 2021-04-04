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
  private typesUrl: Url;
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
      version.viewFunction.URL.toString(),
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
      if (typeof type === "string") {
        const typeUrl = new Url(type, this.typesUrl);
        if (typeUrl === undefined) throw new Error(`type url is undefined`);
        const typeLoaded = await this.loadType(typeUrl.toString());
        resolvedTypeTree.types.push(typeLoaded);
        this.indexType(typeLoaded);
      } else {
        this.indexType(type);
        resolvedTypeTree.types.push(type);
      }
    }
    if (partialTypeTree.groups !== undefined) {
      for await (const group of partialTypeTree.groups) {
        const resolvedGroup: TypeTree = {
          name: group.name,
          iconUrl: group.iconUrl,
          types: [],
          groups: [],
        };
        resolvedTypeTree.groups?.push(resolvedGroup);
        await this.resolveTypeTree(group, resolvedGroup);
      }
    }
  }

  private indexType(type: Type) {
    type.versions.forEach((version) => {
      this.typeVersionMap.set(version.id, { type, version });
    });
  }

  private async loadType(typeUrl: string): Promise<Type> {
    const typeModule = await this.loader.import(new Url(typeUrl));
    const type: Type = typeModule.default;
    return type;
  }
}
