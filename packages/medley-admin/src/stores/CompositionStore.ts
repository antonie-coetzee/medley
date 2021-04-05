import {
  Composition,
  CompositionRepository,
  Loader,
  ModelRepository,
  ModelViewEngine,
  TypeRepository,
} from "@medley/medley-mve";
import { makeAutoObservable, runInAction } from "mobx";

export class CompositionStore {
  private repository: CompositionRepository | undefined;

  constructor(      
    private loader: Loader,
    private typeRepo: TypeRepository,
    private modelRepo: ModelRepository
  ) {}

  public async load(composition: Composition) {
    const repo = new CompositionRepository({
      typeRepository: this.typeRepo,
      modelRepository: this.modelRepo,
      loader: this.loader,
    });
    await repo.load(composition);
    this.repository = repo;
    // try{
    //   const mve = new ModelViewEngine(repo);
    //   const res = await mve.renderModel("e0754165-d127-48be-92c5-85fc25dbca19",[]);
    //   console.log(res);
    // }catch(e){
    //   console.log(e);
    // }
  }
}
