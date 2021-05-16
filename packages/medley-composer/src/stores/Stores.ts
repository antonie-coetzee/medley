import { ModelRepository, TypeRepository } from "medley";
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

  constructor() {
    const typeRepo = new TypeRepository();
    const modelRepo = new ModelRepository();

    this.typeStore = new TypeStore(typeRepo);
    this.modelStore = new ModelStore(modelRepo);
    this.compositionStore = new CompositionStore(typeRepo, modelRepo);
    this.layoutStore = new LayoutStore(this.typeStore);
  }
}
