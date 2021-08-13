import { Dialog } from "@material-ui/core";
import { Medley, MedleyOptions, ModuleType, Type, Node, LinkRepo, TypeRepo, Loader, NodeRepo } from "medley";
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
    const makeObservable = function(this:any){makeAutoObservable(this)};
    const options: MedleyOptions = {
      linkRepo: new LinkRepo(makeObservable),
      typeRepo: new TypeRepo(
        new Loader({
          moduleType: ModuleType.SYSTEM,
          import: async (url) => {
            const module = await System.import(url);
            return module;
          },
        }), makeObservable
      ),
      nodeRepo: new NodeRepo(makeObservable),
    };    

    this.medley = new Medley(options);
    this.typeStore = new TypeStore(this.medley);
    this.layoutStore = new LayoutStore(this.typeStore);
    this.graphStore = new GraphStore(this.medley, this.layoutStore);
    this.dialogStore = new DialogStore();
  }
}
