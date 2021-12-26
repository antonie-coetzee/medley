import { Type, Loader, TreeMap, DEFAULT_SCOPE, Module, isType } from "../core";

export class TypeRepository<MType extends Type<Module> = Type<Module>> {
  /* scope -> type */
  private typeMap: TreeMap<MType> = new TreeMap();

  constructor(public loader: Loader<MType["module"]>) {}

  public setTypes(types: MType[]): void {
    this.typeMap.clearNodes();
    for (const type of types) {
      this.upsertType(type.scope || DEFAULT_SCOPE, type);
    }
  }

  public getTypes(scopeId?: string): MType[] {
    if(scopeId){
      return this.typeMap.getFromPath(false, scopeId);
    }else{
      return this.typeMap.getNodes();
    }
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

  public deleteType(scopeId: string, typeName: string): boolean {
    return this.typeMap.deleteNode(scopeId, typeName);
  }

  public upsertType(scopeId: string, type: MType): boolean {
    const typeScope = type.scope || DEFAULT_SCOPE;
    if(typeScope !== scopeId){
      throw new Error(`type: '${type.name}' with scope: '${type.scope}' not equal to '${scopeId}'`);
    }
    return this.typeMap.setNodeValue(type, typeScope, type.name);
  }

  public async getExport(scopeId:string, typeName: string, exportName: string) {
    const typeObj = this.typeMap.getNodeValue(scopeId, typeName);
    if (typeObj == null) {
      return;
    }
    return this.loader.import(typeObj.module, exportName);
  }
}
