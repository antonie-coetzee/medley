import { Events, Type } from "../core";
import { TypeRepo } from "../repos";

export class TypesApi<TType extends Type = Type> {
  public events: Partial<Events<TType>> = {};

  constructor(
    private scopeId: string,
    private typeRepo: TypeRepo,
    private parentTypes?: TypesApi<TType>,
  ) {}

  public load(types: TType[], baseUrl: URL): void {
    this.typeRepo.load(types, baseUrl);
    if(this.events.onLoad){
      this.events.onLoad(this.getAllTypes());
    }
  }

  public async getExportFunction<T extends Function = Function>(
    typeName: string,
    functionName: string
  ): Promise<T | undefined> {
    const func = await this.typeRepo.getExportFunction<T>(
      this.scopeId,
      typeName,
      functionName
    );
    if (func) {
      return func;
    }
    if (this.parentTypes) {
      return this.parentTypes.getExportFunction<T>(typeName, functionName);
    }
  }

  public async getExport(type: Type, name: string): Promise<any> {
    const typeExport = await this.typeRepo.getExport(type, name);
    if (typeExport) {
      return typeExport;
    }     
  }

  public getTypes(): TType[] {
    const scopeTypes = this.typeRepo.getTypes(this.scopeId) as TType[];
    if (this.parentTypes) {
      const parentTypes = this.parentTypes.getTypes();
      return  [...new Set([...parentTypes, ...scopeTypes])];
    }
    return scopeTypes;
  }

  public getAllTypes(): TType[] {
    return this.typeRepo.getAllTypes() as TType[];
  }

  public getType(typeName: string): TType | undefined {
    const type = this.typeRepo.getType(this.scopeId, typeName) as TType;
    if(type){
      return type;
    }
    if (this.parentTypes) {
      return this.parentTypes.getType(typeName) as TType;
    }
  }

  public hasType(typeName: string): boolean {
    const scopeHasType = this.typeRepo.hasType(this.scopeId, typeName);
    if(scopeHasType){
      return true;
    }
    if (this.parentTypes) {
      return this.parentTypes.hasType(typeName);
    }
    return false;
  }

  public addType(type: TType) {
    let wasAdded = false;
    wasAdded = this.typeRepo.addType(this.scopeId, type);
    if(wasAdded && this.events.onItemAdd){
      this.events.onItemAdd(type);
    }
    if(wasAdded && this.events.onChange){
      this.events.onChange(this.getTypes());
    }
  }
}
