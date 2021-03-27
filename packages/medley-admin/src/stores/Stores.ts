import { MobXProviderContext } from "mobx-react";
import React from "react";
import { ModelGraphStore } from "./ModelGraphStore";
import { PanelStore } from "./PanelStore";

export function useStores() {
  return React.useContext(MobXProviderContext) as Stores;
}

export class Stores {
    public panelStore: PanelStore;
    public modelGraphStore: ModelGraphStore;

    constructor() {
        this.panelStore = new PanelStore();
        this.modelGraphStore = new ModelGraphStore();
    }
}
