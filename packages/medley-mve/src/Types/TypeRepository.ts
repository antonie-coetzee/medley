import Url from "url-parse";
import { Loader, ViewFunction } from "../Core";
import { Type, TypeTree, TypeVersion } from "./Type";

export class TypeRepository {
  private repoUrl: Url;
  private typeVersionMap: Map<string, { type: Type; version: TypeVersion }>;
  private resolvedTypeTree: TypeTree;

  constructor(private loader: Loader) {
    this.getViewFunctionFromTypeVersionId = this.getViewFunctionFromTypeVersionId.bind(this);
  }

  public async loadFromUrl(url: Url): Promise<void> {
    this.repoUrl = url;
    var module = await this.loader.import(url);
    const typeTree: TypeTree = module.default;
    return this.load(typeTree);
  }

  public async load(typeTree: TypeTree): Promise<void> {
    this.resolvedTypeTree = {
      name: typeTree.name,
      iconUrl: typeTree.iconUrl,
      types: [],
      groups: [],
    };
    this.typeVersionMap = new Map();
    await this.resolveTypeTree(typeTree, this.resolvedTypeTree);
  }

  public versionToType(versionId: string): Type | undefined {
    const { type } = this.typeVersionMap.get(versionId) || {};
    return type;
  }

  public async getViewFunctionFromTypeVersionId(
    typeVersionId: string
  ): Promise<ViewFunction> {
    const { type, version } = this.typeVersionMap.get(typeVersionId) || {};
    if (type === undefined || version === undefined)
      throw new Error(`type with version id: ${typeVersionId} not found`);

    const typeModuleUrl = new Url(
      version.viewFunction.URL.toString(),
      this.repoUrl
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

  public get typeTree(): TypeTree {
    return this.resolvedTypeTree;
  }

  private async resolveTypeTree(
    partialTypeMap: TypeTree,
    resolvedTypeMap: TypeTree
  ): Promise<void> {
    for await (const type of partialTypeMap.types) {
      if (typeof type === "string") {
        const typeUrl = new Url(type, this.repoUrl);
        if (typeUrl === undefined) throw new Error(`type url is undefined`);
        const typeLoaded = await this.loadType(typeUrl.toString());
        resolvedTypeMap.types.push(typeLoaded);
        this.indexType(typeLoaded);
      } else {
        this.indexType(type);
        resolvedTypeMap.types.push(type);
      }
    }
    if (partialTypeMap.groups !== undefined) {
      for await (const group of partialTypeMap.groups) {
        const resolvedGroup: TypeTree = {
          name: group.name,
          iconUrl: group.iconUrl,
          types: [],
          groups: [],
        };
        resolvedTypeMap.groups?.push(resolvedGroup);
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
