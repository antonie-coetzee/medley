import { Type, Loader, Part, isModule } from "./core";
import { VIEW_FUNCTION } from "./core/Constants";

export class TypeRepository {
  private typeIndex: Map<string, Type> = new Map();
  private baseUrl?: URL;

  constructor(private loader: Loader) {}

  public load(parts: Part[], baseUrl: URL) {
    this.baseUrl = baseUrl;
    this.typeIndex = new Map();
    const types = parts.map((part) => part.type);
    for (const type of types) {
      if (this.typeIndex.has(type.name)) {
        throw new Error(`type with id: '${type.name}', already indexed`);
      }
      this.typeIndex.set(type.name, type);
    }
  }

  public getViewFunction = async (typeName: string): Promise<Function> => {
    return this.getExportFunction(typeName, VIEW_FUNCTION);
  };

  public async getExportFunction(typeName: string, functionName: string) {
    const moduleFunction = await this.getExport(typeName, functionName);
    if (typeof moduleFunction !== "function") {
      throw new Error(`export for ${typeName}.${functionName} not a function`);
    }
    return moduleFunction as Function;
  }

  public async getExport(typeName: string, name: string) {
    const type = this.typeIndex.get(typeName);
    if (type == null) {
      throw new Error(`type with name: '${typeName}' not found`);
    }
    let moduleInfo = type.module;
    let exportName = name;
    const redirect = type.exportMap?.[name];
    if (redirect) {
      if (typeof redirect === "string") {
        exportName = redirect;
      } else if ((redirect as { name: string }).name && isModule(redirect)) {
        exportName = (redirect as { name: string }).name;
        moduleInfo = redirect;
      } else if (isModule(redirect)) {
        moduleInfo = redirect;
      }
    }
    const module = await this.loader.importModule(
      moduleInfo,
      this.baseUrl,
      `version=${type.version}`
    );
    return module[exportName];
  }

  public getTypes(): Type[] {
    return Array.from(this.typeIndex.values());
  }

  public getType(typeName: string): Type {
    const type = this.typeIndex.get(typeName);
    if (type == null) {
      throw new Error(`type with name: '${typeName}', not found`);
    }
    return type;
  }

  public hasType(typeName: string): boolean {
    const type = this.typeIndex.get(typeName);
    if (type == null) {
      return false;
    } else {
      return true;
    }
  }

  public deleteType(typeName: string) {
    return this.typeIndex.delete(typeName);
  }

  public addType(type: Type) {
    if (this.typeIndex.has(type.name)) {
      throw new Error(`type with name: '${type.name}' exists`);
    }
    this.typeIndex.set(type.name, type);
  }
}
