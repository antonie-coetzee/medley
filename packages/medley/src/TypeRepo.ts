import { Type, Loader, isModule } from "./core";

export class TypeRepo {
  private typeMap: Map<string, Type> = new Map();
  private baseUrl?: URL;

  constructor(private loader: Loader, decorator?:(typeStore:TypeRepo)=>void) {
    decorator?.call(null, this);
  }

  public load(types: Type[], baseUrl: URL) {
    this.baseUrl = baseUrl;
    this.typeMap.clear();
    for (const type of types) {
      if (this.typeMap.has(type.name)) {
        throw new Error(`type with name: '${type.name}', already mapped`);
      }
      this.typeMap.set(type.name, type);
    }
  }

  public getNodeFunction = async (typeName: string): Promise<Function> => {
    return this.getExportFunction(typeName);
  };

  public async getExportFunction(typeName: string, functionName?: string) {
    const moduleFunction = await this.getExport(typeName, functionName);
    if (typeof moduleFunction !== "function") {
      throw new Error(`export ${typeName}[${functionName}] not a function`);
    }
    return moduleFunction as Function;
  }

  public async getExport(typeName: string, name: string = "default") {
    const type = this.typeMap.get(typeName);
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
    return Array.from(this.typeMap.values());
  }

  public getType(typeName: string): Type {
    const type = this.typeMap.get(typeName);
    if (type == null) {
      throw new Error(`type with name: '${typeName}', not found`);
    }
    return type;
  }

  public getPortsFromType(typeName: string) {
    const type = this.typeMap.get(typeName);
    if (type == null) {
      throw new Error(`type with name: '${typeName}', not found`);
    }
    return type.ports;
  }

  public hasType(typeName: string): boolean {
    const type = this.typeMap.get(typeName);
    if (type == null) {
      return false;
    } else {
      return true;
    }
  }

  public deleteType(typeName: string) {
    return this.typeMap.delete(typeName);
  }

  public addType(type: Type) {
    if (this.typeMap.has(type.name)) {
      throw new Error(`type with name: '${type.name}' exists`);
    }
    this.typeMap.set(type.name, type);
  }
}
