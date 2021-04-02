import { Loader, ViewFunction } from "../Core";
import { Type, TypeTree, TypeVersion } from "./Type";

export class TypeRepository {
  private repoUrl: URL;
  private typeMap: Map<string, TypeVersion>;
  private resolvedTypeTree: TypeTree;

  constructor(private loader: Loader) {
    this.getViewFunctionFromTypeId = this.getViewFunctionFromTypeId.bind(this);
  }

  public async loadFromUrl(url: URL): Promise<void> {
    this.repoUrl = url;
    var module = await this.loader.import(url.toString());
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
    this.typeMap = new Map();
    await this.resolveTypeTree(typeTree, this.resolvedTypeTree);
  }

  public async getViewFunctionFromTypeId(
    typeId: string
  ): Promise<ViewFunction> {
    const type = this.typeMap.get(typeId);
    if (type === undefined)
      throw new Error(`type with typeId: ${typeId} not found`);

    const typeModuleUrl = new URL(type.viewFunction.URL.toString(), this.repoUrl);
    if (typeModuleUrl === undefined)
      throw new Error("typeModuleUrl is undefined");

    const typeModule = await this.loader.import(typeModuleUrl.toString());
    if (type.viewFunction.name) {
      return typeModule[type.viewFunction.name];
    } else {
      return typeModule.default;
    }
  }

  public get typeGraph(): TypeTree {
    return this.resolvedTypeTree;
  }

  private async resolveTypeTree(
    partialTypeMap: TypeTree,
    resolvedTypeMap: TypeTree
  ): Promise<void> {
    for await (const type of partialTypeMap.types) {
      if (typeof type === "string") {
        const typeUrl = new URL(type, this.repoUrl);
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
      this.typeMap.set(version.id, version);
    });
  }

  private async loadType(typeUrl: string): Promise<Type> {
    const typeModule = await this.loader.import(typeUrl);
    const type: Type = typeModule.default;
    return type;
  }
}
