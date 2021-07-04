import { Type, Loader, Part } from "./core";
import { MIGRATE_DOWN, MIGRATE_UP, VIEW_FUNCTION } from "./core/Constants";

export class TypeRepository {
  private typeIndex: Map<string, Type> = new Map();
  private baseUrl?: URL;

  constructor(private loader: Loader) {}

  public load(parts: Part[], baseUrl: URL) {
    this.baseUrl = baseUrl;
    this.typeIndex = new Map();
    const types = parts.map(part=>part.type);
    for (const type of types) {
      if (this.typeIndex.has(type.id)) {
        throw new Error(`type with id: '${type.id}', already indexed`);
      }
      this.typeIndex.set(type.id, type);
    }
  }

  public getViewFunction = async (typeId: string): Promise<Function> => {
    return this.getExportFunction(typeId, VIEW_FUNCTION);
  }

  public async getExportFunction(typeId: string, functionName:string){
    const moduleFunction = await this.getExport(typeId, functionName);   
    if(typeof moduleFunction !== 'function'){
      throw new Error(`export for ${typeId}.${functionName} not a function`);
    }
    return moduleFunction as Function;
  }

  public async getExport(typeId: string, name:string){
    const type = this.typeIndex.get(typeId);
    if (type == null) {
      throw new Error(`type with id: '${typeId}' not found`);
    }
    const module = await this.loader.importModule(type.module, this.baseUrl, `version=${type.version}`);
    return module[type.exportMap?.[name] || name];   
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
