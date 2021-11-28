import { Type } from "../core";
import { TypeRepository } from "../repositories";

export class Types<TType extends Type = Type> {
  constructor(
    private scopeId: string,
    private typeRepository: TypeRepository
  ) {}

  public setTypes(types: TType[]): void {
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

  public getTypes(): TType[] {
    return this.typeRepository.getTypes(this.scopeId) as TType[];
  }

  public getAllTypes(): TType[] {
    return this.typeRepository.getAllTypes() as TType[];
  }

  public getType(typeName: string): TType | undefined {
    return this.typeRepository.getType(this.scopeId, typeName) as TType;
  }

  public hasType(typeName: string): boolean {
    return this.typeRepository.hasType(this.scopeId, typeName);
  }

  public addType(type: TType) {
    return this.typeRepository.addType(this.scopeId, type);
  }
}
