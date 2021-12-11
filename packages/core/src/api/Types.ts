import { Module, Type } from "../core";
import { TypeRepository } from "../repositories";

export class Types<MType extends Type<Module> = Type<Module>> {
  constructor(
    private scopeId: string,
    private typeRepository: TypeRepository<MType>
  ) {}

  public setTypes(types: MType[]): void {
    return this.typeRepository.set(types);
  }

  public async getExportFunction<T extends Function = Function>(
    typeName: string,
    functionName: string
  ): Promise<T | undefined> {
    return await this.typeRepository.getExportFunction<T>(
      this.scopeId,
      typeName,
      functionName
    );
  }

  public async getExport<T>(type: Type, name: string): Promise<T | undefined> {
    return await this.typeRepository.getExport(type, name);
  }

  public getTypes(): MType[] {
    return this.typeRepository.getTypes(this.scopeId);
  }

  public getAllTypes(): MType[] {
    return this.typeRepository.getAllTypes();
  }

  public getType(typeName: string): MType | undefined {
    return this.typeRepository.getType(this.scopeId, typeName);
  }

  public hasType(typeName: string): boolean {
    return this.typeRepository.hasType(this.scopeId, typeName);
  }

  public addType(type: MType) {
    return this.typeRepository.addType(this.scopeId, type);
  }
}
