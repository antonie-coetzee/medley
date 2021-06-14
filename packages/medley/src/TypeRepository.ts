import { Type, TypeTree, Loader } from "./core";
import { VIEW_FUNCTION } from "./core/Constants";

export interface TypeRepositoryHooks {
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

  public updateHooks(hooks?: TypeRepositoryHooks) {
    this.onResolvedTypeTreeUpdate =
      hooks?.onResolvedTypeTreeUpdate || this.onResolvedTypeTreeUpdate;
    this.onTypeTreeUpdate = hooks?.onTypeTreeUpdate || this.onTypeTreeUpdate;
    this.onTypesUrlUpdate = hooks?.onTypesUrlUpdate || this.onTypesUrlUpdate;
  }

  public async loadFromUrl(url: string, base?: URL): Promise<void> {
    this.typesUrl = new URL(url, base);
    this.onTypesUrlUpdate(this.typesUrl);
    const typeTree: TypeTree = await this.loader.loadJson(this.typesUrl);
    await this.load(typeTree);
    if(this.resolvedTypeTree){
      this.resolvedTypeTree.origin = url;
    }
  }

  public async load(typeTree: TypeTree, base?:URL): Promise<void> {
    this.typeTree = typeTree;
    this.typesUrl = base;
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
        const typeLoaded = await this.loadType(type.toString(), this.typesUrl);
        typeLoaded.origin = type.toString();
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
          groupTypeTree = await this.loadGroup(group.toString(), this.typesUrl);
        } else {
          groupTypeTree = group as TypeTree;
        }
        const resolvedGroup: TypeTree = {
          name: groupTypeTree.name,
          icon: groupTypeTree.icon,
          origin:groupTypeTree.origin,
          types: [],
          groups: [],
        };
        resolvedTypeTree.groups?.push(resolvedGroup);
        await this.resolveTypeTree(groupTypeTree, resolvedGroup);
      }
    }
  }

  private indexType(type: Type) {
    if(this.typeMap.has(type.id)){
      throw new Error(`type with id: '${type.id}', already registered`);
    }
    this.typeMap.set(type.id, type);
  }

  private async loadGroup(url: string, base?:URL): Promise<TypeTree> {
    const typeTree: TypeTree = await this.loader.loadJson(new URL(url, base));
    typeTree.origin = url;
    return typeTree;
  }

  private async loadType(url: string, base?:URL): Promise<Type> {
    const type: Type = await this.loader.loadJson(new URL(url, base));
    type.origin = url;
    return type;
  }
}
