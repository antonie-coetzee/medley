import { Dialog } from "@material-ui/core";
import { Medley, MedleyOptions, ModuleType, Type, Node } from "medley";
import { MobXProviderContext } from "mobx-react";
import React from "react";
import { GraphStore } from "./GraphStore";
import { DialogStore } from "./DialogStore";
import { LayoutStore } from "./LayoutStore";
import { TypeStore } from "./TypeStore";
import { makeAutoObservable, observable } from "mobx";

export function useStores() {
  return React.useContext(MobXProviderContext) as Stores;
}

export class Stores {
  public layoutStore: LayoutStore;
  public graphStore: GraphStore;
  public typeStore: TypeStore;
  public dialogStore: DialogStore;
  public medley: Medley;

  constructor() {
    const options: MedleyOptions = {
      loader: {
        import: (url: string) => System.import(url),
        moduleType: ModuleType.SYSTEM,
      },
      decorate: {
        medley: (m) => {
          makeAutoObservable(m);
        },
        typeRepo: (t) => {
          makeAutoObservable(t);
        },
        nodeRepo: (n) => {
          makeAutoObservable(n);
        },
        linkRepo: (l) => {
          makeAutoObservable(l);
        },
      },
    };

    this.medley = new Medley(options);
    this.typeStore = new TypeStore(this.medley);
    this.layoutStore = new LayoutStore(this.typeStore);
    this.graphStore = new GraphStore(this.medley, this.layoutStore);
    this.dialogStore = new DialogStore();
  }
}
