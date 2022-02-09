import { Type } from "../core";
import { TypeRepository } from "../repositories";

export class Types<MType extends Type = Type> {
  constructor(
    private scopeId: string,
    private typeRepository: TypeRepository<MType>
  ) {}

  public async getExport<T>(
    typeName: string,
    exportName: string
  ): Promise<T | undefined> {
    return (await this.typeRepository.getExport(
      this.scopeId,
      typeName,
      exportName
    )) as T;
  }

  public async getTypes(): Promise<MType[]> {
    return this.typeRepository.getTypes(this.scopeId);
  }

  public async getType(typeName: string): Promise<MType | undefined> {
    return this.typeRepository.getType(this.scopeId, typeName);
  }

  public async hasType(typeName: string): Promise<boolean> {
    return this.typeRepository.hasType(this.scopeId, typeName);
  }

  public async upsertType(type: MType): Promise<boolean> {
    return this.typeRepository.upsertType(this.scopeId, type);
  }
}
