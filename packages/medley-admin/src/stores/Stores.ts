import { Loader, ModelRepository, TypeRepository } from "@medley/medley-mve";
import { MobXProviderContext } from "mobx-react";
import React from "react";
import { CompositionStore } from "./CompositionStore";
import { LayoutStore } from "./LayoutStore";
import { ModelStore } from "./ModelStore";
import { TypeStore } from "./TypeStore";

export function useStores() {
  return React.useContext(MobXProviderContext) as Stores;
}

export class Stores {
  public layoutStore: LayoutStore;
  public compositionStore: CompositionStore;
  public typeStore: TypeStore;
  public modelStore: ModelStore;

  private loader:Loader;

  constructor() {
    const loader = new Loader();
    const typeRepo = new TypeRepository(loader);
    const modelRepo = new ModelRepository();

    this.loader = loader;
    this.typeStore = new TypeStore(typeRepo);
    this.modelStore = new ModelStore(modelRepo);
    this.compositionStore = new CompositionStore(loader, typeRepo, modelRepo);
    this.layoutStore = new LayoutStore(this.typeStore);
  }
}
