import { ModelRepository, ModelsOfType } from "@medley/medley-mve";

export class ModelStore {
  constructor(private modelRepository:ModelRepository) {}

  public getModelsByTypeVersionId(typeId: string): ModelsOfType | undefined {
    return this.modelRepository.getModelsByTypeId(typeId);
  }
}
