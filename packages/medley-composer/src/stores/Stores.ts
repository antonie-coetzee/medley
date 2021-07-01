import { Medley, MedleyOptions, ModuleType } from "medley";
import { MobXProviderContext } from "mobx-react";
import React from "react";
import { CompositionStore } from "./CompositionStore";
import { LayoutStore } from "./LayoutStore";
import { ModelStore } from "./ModelStore";
import { TypeStore } from "./TypeStore";
import "systemjs";

export function useStores() {
  return React.useContext(MobXProviderContext) as Stores;
}

export class Stores {
  public layoutStore: LayoutStore;
  public compositionStore: CompositionStore;
  public typeStore: TypeStore;
  public modelStore: ModelStore;

  constructor() {
    const options: MedleyOptions = {
      loader: {
        import: (url) => System.import(url),
        moduleType: ModuleType.SYSTEM
      },
    };
    const medley = new Medley(options)
    this.typeStore = new TypeStore(medley);
    this.modelStore = new ModelStore(medley);
    this.compositionStore = new CompositionStore(medley);
    this.layoutStore = new LayoutStore(this.typeStore);
  }
}
