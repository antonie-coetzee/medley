import { EventType, MedleyEvent, Type } from "../core";
import { TypeRepo } from "../repos";

export class TypesApi<TType extends Type = Type> extends EventTarget {

  constructor(
    private scopeId: string,
    private typeRepo: TypeRepo,
    private parentTypes?: TypesApi<TType>,
  ) {
    super();
  }

  public load(types: TType[], baseUrl: URL): void {
    this.typeRepo.load(types, baseUrl);
    this.dispatchEvent(new MedleyEvent(EventType.OnLoad));
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
      return [...new Set([...parentTypes, ...scopeTypes])];
    }
    return scopeTypes;
  }

  public getAllTypes(): TType[] {
    return this.typeRepo.getAllTypes() as TType[];
  }

  public getType(typeName: string): TType | undefined {
    const type = this.typeRepo.getType(this.scopeId, typeName) as TType;
    if (type) {
      return type;
    }
    if (this.parentTypes) {
      return this.parentTypes.getType(typeName) as TType;
    }
  }

  public hasType(typeName: string): boolean {
    const scopeHasType = this.typeRepo.hasType(this.scopeId, typeName);
    if (scopeHasType) {
      return true;
    }
    if (this.parentTypes) {
      return this.parentTypes.hasType(typeName);
    }
    return false;
  }

  public addType(type: TType) {
    const allowed = this.dispatchEvent(MedleyEvent.createCancelable(EventType.OnItemAdd, type));
    if (allowed === false) {
      return;
    }
    if (this.typeRepo.addType(this.scopeId, type)) {
      this.dispatchEvent(MedleyEvent.create(EventType.OnChange));
    }
  }
}
