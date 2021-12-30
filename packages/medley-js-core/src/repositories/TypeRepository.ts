import { Type, TreeMap, DEFAULT_SCOPE, Loader} from "../core";

export class TypeRepository<MType extends Type = Type> {
  /* scope -> type */
  private typeMap: TreeMap<MType> = new TreeMap();

  constructor(public loader: Loader<MType>) {}

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
    const type = this.typeMap.getNodeValue(scopeId, typeName);
    if (type == null) {
      return;
    }
    return this.loader.import(type, exportName);
  }
}
