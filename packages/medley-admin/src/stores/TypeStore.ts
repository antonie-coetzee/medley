import { Loader, ModelGraph, TypeMapRepository } from "@medley/medley-mve";
import { autorun, makeAutoObservable, runInAction } from "mobx";
import { ModelGraphStore } from "./ModelGraphStore";

export class TypeStore {
  public typeMapRepository: TypeMapRepository | null;

  constructor(
    private loader: Loader,
    private modelGraphStore: ModelGraphStore
  ) {
    makeAutoObservable(this);
    this.typeMapRepository = null;

    autorun(async () => {
      const modelGraph = modelGraphStore.modelGraph;
      if (modelGraph == null) return;

      console.log("modelGraph:", modelGraph);
      await this.updateTypeRepository(modelGraph);
    });
  }

  private async updateTypeRepository(modelGraph: ModelGraph) {
    const typeRepo = new TypeMapRepository(this.loader);
    await typeRepo.load(modelGraph.typeMap);
    runInAction(() => {
      this.typeMapRepository = typeRepo;
    });
  }
}
