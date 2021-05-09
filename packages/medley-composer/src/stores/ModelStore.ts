import { ModelRepository, ModelsOfType, TypedModel } from "../../../medley/dist/medley.js"
import { observable } from "mobx";

export class ModelStore {
  constructor(private modelRepository:ModelRepository) {
    modelRepository.updateOptions({
      modelsOfTypeLoadHook: (mot)=>{
        return observable(mot);
      }
    })

  }

  public getModelsByTypeVersionId(typeId: string): ModelsOfType | undefined {
    return this.modelRepository.getModelsByTypeId(typeId);
  }

  public async upsertModel(model: Partial<TypedModel>): Promise<void> {
    return this.modelRepository.upsertModel(model);
  }
}
