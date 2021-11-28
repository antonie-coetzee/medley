import { Type, Loader, isModule, TreeMap, ROOT_SCOPE, Module } from "../core";

export class TypeRepository {
  /* scope -> type */
  private typeMap: TreeMap<Type> = new TreeMap();

  constructor(public loader: Loader) {}

  public set(types: Type[]) {
    this.typeMap.clear();
    for (const type of types) {
      this.typeMap.setNodeValue(type, type.scope || ROOT_SCOPE, type.name);
    }
  }

  public async getExportFunction<T extends Function = Function>(
    scope: string,
    typeName: string,
    functionName: string
  ) {
    const type = this.typeMap.getNodeValue(scope, typeName);
    if (type == null) {
      return;
    }
    const moduleFunction = await this.getExport(type, functionName);
    return moduleFunction as T;
  }

  public async getExport(type: Type, name: string) {
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

    let module = await this.loader.importModule(moduleInfo);

    if (moduleInfo.nameSpace) {
      return module[moduleInfo.nameSpace][exportName];
    } else {
      return module[exportName];
    }
  }

  public getTypes(scopeId: string): Type[] {
    return this.typeMap.getFromPath(false, scopeId);
  }

  public getAllTypes(): Type[] {
    return this.typeMap.getAll();
  }

  public getType(scopeId: string, typeName: string): Type | undefined {
    return this.typeMap.getNodeValue(scopeId, typeName);
  }

  public hasType(scopeId: string, typeName: string): boolean {
    const type = this.typeMap.getNodeValue(scopeId, typeName);
    if (type == null) {
      return false;
    } else {
      return true;
    }
  }

  public deleteType(scopeId: string, typeName: string) {
    return this.typeMap.deleteNode(scopeId, typeName);
  }

  public addType(scopeId: string, type: Type) {
    type.scope = scopeId || ROOT_SCOPE;
    return this.typeMap.setNodeValue(type, type.scope, type.name);
  }
}
