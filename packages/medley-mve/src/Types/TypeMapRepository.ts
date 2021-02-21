import { Loader, ViewFunction } from "../Core";
import { Type, TypeVersion } from "./Type";
import { TypeMap } from "./TypeMap";

export class TypeMapRepository {
  private parentDirectory: string;
  private typeIndex: Map<string, TypeVersion>;
  private resolvedTypeMap: TypeMap;

  constructor(private loader: Loader) {
    this.getViewFunctionFromTypeId = this.getViewFunctionFromTypeId.bind(this);
  }

  public async loadUrl(url: string): Promise<void> {
    this.parentDirectory = url.substring(0, url.lastIndexOf("/") + 1);
    var module = await this.loader.import(url);
    const tmap: TypeMap = module.default;
    return this.loadTypeMap(tmap)
  }

  public async loadTypeMap(typeMap: TypeMap): Promise<void> {
    this.resolvedTypeMap = {
      name: typeMap.name,
      iconUrl: typeMap.iconUrl,
      types: [],
      groups: [],
    };
    this.typeIndex = new Map();
    await this.resolveTypeMap(typeMap, this.resolvedTypeMap);
  }

  public async getViewFunctionFromTypeId(
    typeId: string
  ): Promise<ViewFunction> {
    const type = this.typeIndex.get(typeId);
    if (type === undefined)
      throw new Error(`type with typeId: ${typeId} not found`);

    const typeModuleUrl = this.formatUrl(type.moduleUrl);
    if (typeModuleUrl === undefined)
      throw new Error("typeModuleUrl is undefined");

    const typeModule = await this.loader.import(typeModuleUrl);
    if (type.export) {
      return typeModule[type.export];
    } else {
      return typeModule.default;
    }
  }

  public get typeGraph(): TypeMap {
    return this.resolvedTypeMap;
  }

  private relativeUrlRegex: RegExp = new RegExp("^(?:[a-z]+:)?//", "i");
  private isRelativeUrl(url: string) {
    return !this.relativeUrlRegex.test(url);
  }

  private formatUrl(url: string | undefined) {
    if (url === undefined) {
      return;
    }
    if (this.isRelativeUrl(url)) {
      return this.parentDirectory + url;
    } else {
      return url;
    }
  }
  
  private async resolveTypeMap(
    partialTypeMap: TypeMap,
    resolvedTypeMap: TypeMap
  ): Promise<void> {
    partialTypeMap.types.forEach(async (type) => {
      if (typeof type === "string") {
        const typeUrl = this.formatUrl(type);
        if (typeUrl === undefined)
          throw new Error(`type url is undefined`);
        const typeLoaded = await this.loadType(typeUrl);
        resolvedTypeMap.types.push(typeLoaded);
        this.indexType(typeLoaded);
      } else {
        this.indexType(type);
        resolvedTypeMap.types.push(type);
      }
    });
    partialTypeMap.groups?.forEach(async (group) => {
      const resolvedGroup: TypeMap = {
        name: group.name,
        iconUrl: group.iconUrl,
        types: [],
        groups: [],
      };
      resolvedTypeMap.groups?.push(resolvedGroup);
      await this.resolveTypeMap(group, resolvedGroup);
    });
  }

  private indexType(type: Type) {
    type.versions.forEach((version) => {
      this.typeIndex.set(version.id, version);
    });
  }

  private async loadType(typeUrl: string): Promise<Type> {
    const typeModule = await this.loader.import(typeUrl);
    const type: Type = typeModule.default;
    return type;
  }
}
