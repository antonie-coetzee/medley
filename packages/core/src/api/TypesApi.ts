import { EventType, MedleyEvent, Type, Unwrap } from "../core";
import { TypeRepo } from "../repos";

export class TypesApi<TType extends Type = Type> {
  public parent?: TypesApi<TType>;
  constructor(private scopeId: string, private typeRepo: TypeRepo) {}

  public setOrigin(origin: string) {
    this.typeRepo.loader.origin = origin;
  }

  public setTypes(types: TType[], baseUrl: URL): void {
    this.typeRepo.set(types, baseUrl);
  }

  public async runExportFunction<T extends (...args: any) => any>(
    typeName: string,
    functionName: string,
    ...params: Parameters<T>
  ): Promise<Unwrap<ReturnType<T>> | undefined> {
    const exportFunc = (await this.getExportFunction(
      typeName,
      functionName
    )) as T;
    if (exportFunc == null) {
      return;
    }
    return exportFunc(...(params as any[]));
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
    if (this.parent) {
      return this.parent.getExportFunction<T>(typeName, functionName);
    }
  }

  public async getExport<T>(type: Type, name: string): Promise<T | undefined> {
    const typeExport = await this.typeRepo.getExport(type, name);
    if (typeExport) {
      return typeExport as T;
    }
  }

  public getTypes(): TType[] {
    const scopeTypes = this.typeRepo.getTypes(this.scopeId) as TType[];
    if (this.parent) {
      const parentTypes = this.parent.getTypes();
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
    if (this.parent) {
      return this.parent.getType(typeName) as TType;
    }
  }

  public hasType(typeName: string): boolean {
    const scopeHasType = this.typeRepo.hasType(this.scopeId, typeName);
    if (scopeHasType) {
      return true;
    }
    if (this.parent) {
      return this.parent.hasType(typeName);
    }
    return false;
  }

  public addType(type: TType) {
    this.typeRepo.addType(this.scopeId, type);
  }
}
