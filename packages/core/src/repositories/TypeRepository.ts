import { Type, Loader, TreeMap, ROOT_SCOPE, Module, isType } from "../core";

export class TypeRepository<MType extends Type<Module> = Type<Module>> {
  /* scope -> type */
  private typeMap: TreeMap<MType> = new TreeMap();

  constructor(public loader: Loader<MType["module"]>) {}

  public set(types: MType[]) {
    this.typeMap.clearAllNodes();
    for (const type of types) {
      this.typeMap.setNodeValue(type, type.scope || ROOT_SCOPE, type.name);
    }
  }

  public async getExport(scopeId:string, typeName: string, exportName: string) {
    const typeObj = this.typeMap.getNodeValue(scopeId, typeName);
    if (typeObj == null) {
      return;
    }
    return this.loader.import(typeObj.module, exportName);
  }

  public getTypes(scopeId: string): MType[] {
    return this.typeMap.getFromPath(false, scopeId);
  }

  public getAllTypes(): MType[] {
    return this.typeMap.getAllNodes();
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
