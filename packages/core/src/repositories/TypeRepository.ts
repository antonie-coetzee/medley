import { Type, Loader, TreeMap, ROOT_SCOPE } from "../core";

export class TypeRepository<MType extends Type = Type> {
  /* scope -> type */
  private typeMap: TreeMap<MType> = new TreeMap();

  constructor(public loader: Loader) {}

  public set(types: MType[]) {
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
      } else if (redirect.name && this.loader.isModule(redirect)) {
        exportName = redirect.name.toString();
        moduleInfo = redirect;
      } else if (this.loader.isModule(redirect)) {
        moduleInfo = redirect;
      }
    }

    let module = await this.loader.import(moduleInfo);

    if (moduleInfo.nameSpace) {
      return module[moduleInfo.nameSpace][exportName];
    } else {
      return module[exportName];
    }
  }

  public getTypes(scopeId: string): MType[] {
    return this.typeMap.getFromPath(false, scopeId);
  }

  public getAllTypes(): MType[] {
    return this.typeMap.getAll();
  }

  public getType(scopeId: string, typeName: string): MType | undefined {
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

  public addType(scopeId: string, type: MType) {
    type.scope = scopeId || ROOT_SCOPE;
    return this.typeMap.setNodeValue(type, type.scope, type.name);
  }
}
