import {
  Composition,
  CompositionRepository,
  ModelRepository,
  ModelViewEngine,
  TypeRepository,
} from "medley";
import { makeAutoObservable, runInAction } from "mobx";

export class CompositionStore {
  private repository: CompositionRepository | undefined;

  constructor(
    private typeRepo: TypeRepository,
    private modelRepo: ModelRepository
  ) {}

  public async load(composition: Composition) {
    const repo = new CompositionRepository({
      typeRepository: this.typeRepo,
      modelRepository: this.modelRepo,
    });
    await repo.load(composition, new URL(window.location.toString()));
    this.repository = repo;
    // try{
    //   const mve = new ModelViewEngine(repo);
    //   const res = await mve.renderModel("e0754165-d127-48be-92c5-85fc25dbca19",[]);
    //   console.log(res);
    // }catch(e){
    //   console.log(e);
    // }
  }

  public getComposition(): Composition | undefined {
    return this.repository?.composition;
  }
}
