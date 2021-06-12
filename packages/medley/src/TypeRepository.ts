import { Type, TypeTree, Loader } from "./core";
import { VIEW_FUNCTION } from "./core/Constants";

export interface TypeRepositoryOptions {
  onResolvedTypeTreeUpdate?: (typeTree: TypeTree) => void;
  onTypeTreeUpdate?: (typeTree: TypeTree) => void;
  onTypesUrlUpdate?: (typesUrl: URL) => void;
}

export class TypeRepository {
  private typeMap: Map<string, Type> = new Map();
  private onResolvedTypeTreeUpdate: (typeTree: TypeTree) => void = () => {};
  private onTypeTreeUpdate: (typeTree: TypeTree) => void = () => {};
  private onTypesUrlUpdate: (typesUrl: URL) => void = () => {};

  public typesUrl: URL | undefined;
  public resolvedTypeTree: TypeTree | undefined;
  public typeTree: TypeTree | undefined;

  constructor(public loader: Loader) {
    this.getViewFunction = this.getViewFunction.bind(this);
  }

  public updateOptions(options?: TypeRepositoryOptions) {
    this.onResolvedTypeTreeUpdate =
      options?.onResolvedTypeTreeUpdate || this.onResolvedTypeTreeUpdate;
    this.onTypeTreeUpdate = options?.onTypeTreeUpdate || this.onTypeTreeUpdate;
    this.onTypesUrlUpdate = options?.onTypesUrlUpdate || this.onTypesUrlUpdate;
  }

  public async loadFromUrl(url: URL): Promise<void> {
    this.typesUrl = url;
    this.onTypesUrlUpdate(this.typesUrl);
    const typeTree: TypeTree = await this.loader.loadJson(url);
    return this.load(typeTree);
  }

  public async load(typeTree: TypeTree): Promise<void> {
    this.typeTree = typeTree;
    this.onTypeTreeUpdate(this.typeTree);
    this.resolvedTypeTree = {
      name: typeTree.name,
      icon: typeTree.icon,
      types: [],
      groups: [],
    };
    this.typeMap = new Map();
    await this.resolveTypeTree(typeTree, this.resolvedTypeTree);
    this.onResolvedTypeTreeUpdate(this.resolvedTypeTree);
  }

  public async getViewFunction(typeId: string): Promise<Function> {
    const type = this.typeMap.get(typeId);
    if (type == null) {
      throw new Error(`type with id: '${typeId}' not found`);
    }

    const module = await this.loader.importModule(type.module, this.typesUrl);
    return module[type.exportMap?.viewFunction || VIEW_FUNCTION];
  }

  private async resolveTypeTree(
    partialTypeTree: TypeTree,
    resolvedTypeTree: TypeTree
  ): Promise<void> {
    for await (const type of partialTypeTree.types) {
      if ((type as Type).name == null) {
        const typeUrl = new URL(type.toString(), this.typesUrl);
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
        if ((group as TypeTree).name == null) {
          const groupUrl = new URL(group.toString(), this.typesUrl);
          groupTypeTree = await this.loadGroup(groupUrl);
        } else {
          groupTypeTree = group as TypeTree;
        }
        const resolvedGroup: TypeTree = {
          name: groupTypeTree.name,
          icon: groupTypeTree.icon,
          types: [],
          groups: [],
        };
        resolvedTypeTree.groups?.push(resolvedGroup);
        await this.resolveTypeTree(groupTypeTree, resolvedGroup);
      }
    }
  }

  private indexType(type: Type) {
    this.typeMap.set(type.id, type);
  }

  public async loadGroup(url: URL): Promise<TypeTree> {
    const typeTree: TypeTree = await this.loader.loadJson(url);
    return typeTree;
  }

  private async loadType(url: URL): Promise<Type> {
    const type: Type = await this.loader.loadJson(url);
    return type;
  }
}
