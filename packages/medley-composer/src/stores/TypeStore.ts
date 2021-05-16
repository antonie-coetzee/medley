import { Type, TypeRepository, TypeTree } from "medley";
import { makeAutoObservable, runInAction } from "mobx";

export class TypeStore {
  public typeTree:TypeTree | undefined;

  constructor(private typeRepository: TypeRepository) {
    makeAutoObservable(this, {typeTree:true})

    typeRepository.updateOptions({onResolvedTypeTreeUpdate: (typeTree)=>{
      runInAction(()=>{
        this.typeTree = typeTree;
      })
    }})
  }

  public typeVersionToType(typeVersionId: string): Type | undefined {
    return this.typeRepository.versionToType(typeVersionId);
  }
}
