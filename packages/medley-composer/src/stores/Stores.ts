import { Dialog } from "@material-ui/core";
import { MapType, Medley, MedleyOptions, ModuleType, Type, Node } from "medley";
import { MobXProviderContext } from "mobx-react";
import React from "react";
import { GraphStore } from "./GraphStore";
import { DialogStore } from "./DialogStore";
import { LayoutStore } from "./LayoutStore";
import { NodeStore } from "./NodeStore";
import { TypeStore } from "./TypeStore";
import { observable } from "mobx";

export function useStores() {
  return React.useContext(MobXProviderContext) as Stores;
}

export class Stores {
  public layoutStore: LayoutStore;
  public graphStore: GraphStore;
  public typeStore: TypeStore;
  public modelStore: NodeStore;
  public dialogStore: DialogStore;

  constructor() {
    const mapFactory = new MapFactory();
    const options: MedleyOptions = {
      loader: {
        import: (url) => System.import(url),
        moduleType: ModuleType.SYSTEM
      },
      mapFactory: mapFactory.newMap
    };
    const medley = new Medley(options)
    this.typeStore = new TypeStore(medley, mapFactory.typeMap);
    this.modelStore = new NodeStore(medley, mapFactory.nodeMap);
    this.layoutStore = new LayoutStore(this.typeStore);
    this.graphStore = new GraphStore(medley, this.layoutStore); 
    this.dialogStore = new DialogStore();
  }
}

class MapFactory{
  public typeMap: Map<string, Type>;
  public nodeMap: Map<string, Node>;

  constructor() {
    this.typeMap = observable.map();
    this.nodeMap = observable.map();
  }

  public newMap = <K,V>(mapType:MapType) => {
    if(mapType === MapType.Type){
      return this.typeMap;
    }
    if(mapType === MapType.Node){
      return this.nodeMap;
    }
    return new Map();
  }
}
