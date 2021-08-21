import { Type } from "./core";
import { NodeFunction } from "./NodeFunction";
import { TypeRepo } from "./TypeRepo";

export class TypesApi<TType extends Type = Type> implements Omit<TypeRepo, "deleteType"> {
  constructor(private typeRepo: TypeRepo) {}

  public load(types: TType[], baseUrl: URL): void {
    this.typeRepo.load(types, baseUrl);
  }

  public async getNodeFunction(typeName: string): Promise<NodeFunction> {
    return this.typeRepo.getNodeFunction(typeName);
  }

  public async getExportFunction<T extends Function = Function>(
    typeName: string,
    functionName?: string
  ) {
    return this.typeRepo.getExportFunction<T>(typeName, functionName);
  }

  public async getExport(typeName: string, name: string = "default") {
    return this.typeRepo.getExport(typeName, name);
  }

  public getTypes():TType[] {
    return this.typeRepo.getTypes() as TType[];
  }

  public getType(typeName: string): TType {
    return this.typeRepo.getType(typeName) as TType;
  }

  public hasType(typeName: string): boolean {
    return this.typeRepo.hasType(typeName);
  }
  
  public addType(type: TType) {
    return this.typeRepo.addType(type);
  }
}
