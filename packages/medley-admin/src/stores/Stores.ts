import { Loader } from "@medley/medley-mve";
import { MobXProviderContext } from "mobx-react";
import React from "react";
import { CompositionStore } from "./CompositionStore";
import { LayoutStore } from "./LayoutStore";

export function useStores() {
  return React.useContext(MobXProviderContext) as Stores;
}

export class Stores {
  public layoutStore: LayoutStore;
  public compositionStore: CompositionStore;

  constructor() {
    this.compositionStore = new CompositionStore();
    this.layoutStore = new LayoutStore(this.compositionStore);
  }
}
