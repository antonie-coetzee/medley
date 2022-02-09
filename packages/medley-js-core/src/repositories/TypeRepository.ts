import { Type, TreeMap, DEFAULT_SCOPE, Loader} from "../core";

export class TypeRepository<MType extends Type = Type> {
  /* scope -> type */
  private typeMap: TreeMap<MType> = new TreeMap();

  constructor(public loader: Loader<MType>) {}

  public async setTypes(types: MType[]): Promise<void> {
    this.typeMap.clearNodes();
    for (const type of types) {
      this.upsertType(type.scope || DEFAULT_SCOPE, type);
    }
  }

  public async getTypes(scopeId?: string): Promise<MType[]> {
    if(scopeId){
      return this.typeMap.getFromPath(false, scopeId);
    }else{
      return this.typeMap.getNodes();
    }
  }

  public async getType(scopeId: string, typeName: string): Promise<MType | undefined> {
    return this.typeMap.getNodeValue(scopeId, typeName);
  }

  public async hasType(scopeId: string, typeName: string): Promise<boolean> {
    const type = this.typeMap.getNodeValue(scopeId, typeName);
    if (type == null) {
      return false;
    } else {
      return true;
    }
  }

  public async deleteType(scopeId: string, typeName: string): Promise<boolean> {
    return this.typeMap.deleteNode(scopeId, typeName);
  }

  public async upsertType(scopeId: string, type: MType): Promise<boolean> {
    const typeScope = type.scope || DEFAULT_SCOPE;
    if(typeScope !== scopeId){
      throw new Error(`type: '${type.name}' with scope: '${type.scope}' not equal to '${scopeId}'`);
    }
    return this.typeMap.setNodeValue(type, typeScope, type.name);
  }

  public async getExport(scopeId:string, typeName: string, exportName: string) : Promise<unknown> {
    const type = this.typeMap.getNodeValue(scopeId, typeName);
    if (type == null) {
      return;
    }
    return this.loader.import(type, exportName);
  }
}
