import { Composition, CompositionRepository } from "@medley/medley-mve";
import { action, makeAutoObservable, runInAction } from "mobx";

export class CompositionStore {
  public repository: CompositionRepository | null = null;

  constructor() {
    makeAutoObservable(this, { repository: true});
  }

  public async load(composition: Composition) {
    const repo = new CompositionRepository();
    await repo.load(composition);
    runInAction(()=>{
        this.repository = repo;
    });
  }
}
