import { Type, Loader, isModule } from "../core";

export class TypeRepo {
  private typeMap: Map<string, Type> = new Map();
  private scopedTypeMap: Map<string, Type> = new Map();
  private baseUrl?: URL;

  constructor(private loader: Loader, onConstruct?: (this: TypeRepo) => void) {
    onConstruct?.call(this);
  }

  public newChild() {
    const childTypeRepo = new TypeRepo(this.loader);
    childTypeRepo.typeMap = this.typeMap;
    childTypeRepo.baseUrl = this.baseUrl;
    return childTypeRepo;
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

  public async getExportFunction<T extends Function = Function>(
    typeName: string,
    functionName?: string
  ) {
    const moduleFunction = await this.getExport(typeName, functionName);
    if (typeof moduleFunction !== "function") {
      throw new Error(`export '${functionName}' from type '${typeName}' not a function`);
    }
    return moduleFunction as T;
  }

  public async getExport(typeName: string, name: string = "default") {
    const type = this.scopedTypeMap.get(typeName) ?? this.typeMap.get(typeName);
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

  public getTypes(scoped?: boolean): Type[] {
    let map = this.getMap(scoped);
    return Array.from(map.values());
  }

  public getType(typeName: string, scoped?: boolean): Type {
    let map = this.getMap(scoped);
    const type = map.get(typeName);
    if (type == null) {
      throw new Error(`type with name: '${typeName}', not found`);
    }
    return type;
  }

  public hasType(typeName: string, scoped?: boolean): boolean {
    let map = this.getMap(scoped);
    const type = map.get(typeName);
    if (type == null) {
      return false;
    } else {
      return true;
    }
  }

  public deleteType(typeName: string, scoped?: boolean) {
    let map = this.getMap(scoped);
    return map.delete(typeName);
  }

  public addType(type: Type, scoped?: boolean) {
    let map = this.getMap(scoped);
    if (map.has(type.name)) {
      throw new Error(`type with name: '${type.name}' exists`);
    }
    map.set(type.name, type);
  }

  private getMap(scoped?: boolean) {
    return scoped ? this.scopedTypeMap : this.typeMap;
  }
}
