import { Type } from "../core";
import { TypeRepository } from "../repositories";

export class Types<MType extends Type = Type> {
  constructor(
    private scopeId: string,
    private typeRepository: TypeRepository<MType>
  ) {}

  public async getExport<T>(typeName: string, exportName: string): Promise<T | undefined> {
    return await this.typeRepository.getExport(this.scopeId, typeName, exportName) as T;
  }

  public getTypes(): MType[] {
    return this.typeRepository.getTypes(this.scopeId);
  }

  public getType(typeName: string): MType | undefined {
    return this.typeRepository.getType(this.scopeId, typeName);
  }

  public hasType(typeName: string): boolean {
    return this.typeRepository.hasType(this.scopeId, typeName);
  }

  public addType(type: MType) {
    return this.typeRepository.upsertType(this.scopeId, type);
  }
}
