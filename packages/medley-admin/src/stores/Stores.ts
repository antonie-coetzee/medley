import { Loader } from "@medley/medley-mve";
import { MobXProviderContext } from "mobx-react";
import React from "react";
import { ModelGraphStore } from "./ModelGraphStore";
import { PanelStore } from "./PanelStore";
import { TypeStore } from "./TypeStore";

export function useStores() {
  return React.useContext(MobXProviderContext) as Stores;
}

export class Stores {
    public panelStore: PanelStore;
    public modelGraphStore: ModelGraphStore;
    public typeStore: TypeStore;

    constructor() {
        this.panelStore = new PanelStore();
        this.modelGraphStore = new ModelGraphStore();
        this.typeStore = new TypeStore(new Loader(), this.modelGraphStore);
    }
}
