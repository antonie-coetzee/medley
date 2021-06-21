import { Type, TypeTree, Loader } from "./core";
import { VIEW_FUNCTION } from "./core/Constants";

export class TypeRepository {
  private typeIndex: Map<string, Type> = new Map();
  private baseUrl?: URL;

  constructor(private loader: Loader) {
    this.getViewFunction = this.getViewFunction.bind(this);
  }

  public load(types: Type[], baseUrl: URL) {
    this.baseUrl = baseUrl;
    this.typeIndex = new Map();
    for (const type of types) {
      if (this.typeIndex.has(type.id)) {
        throw new Error(`type with id: '${type.id}', already indexed`);
      }
      this.typeIndex.set(type.id, type);
    }
  }

  public async getViewFunction(typeId: string): Promise<Function> {
    const type = this.typeIndex.get(typeId);
    if (type == null) {
      throw new Error(`type with id: '${typeId}' not found`);
    }

    const module = await this.loader.importModule(type.module, this.baseUrl);
    return module[type.exportMap?.viewFunction || VIEW_FUNCTION];
  }

  public getTypes(): Type[] {
    return Array.from(this.typeIndex.values());
  }

  public getTypeById(typeId: string): Type {
    const type = this.typeIndex.get(typeId);
    if (type == null) {
      throw new Error(`type with id: '${typeId}', not found`);
    }
    return type;
  }

  public hasTypeById(typeId: string): boolean {
    const type = this.typeIndex.get(typeId);
    if (type == null) {
      return false;
    } else {
      return true;
    }
  }

  public deleteType(typeId: string) {
    return this.typeIndex.delete(typeId);
  }

  public addType(type: Type) {
    if(this.typeIndex.has(type.id)){
      throw new Error(`type with id: '${type.id}' exists`);
    }
    this.typeIndex.set(type.id, type);
  }
}
