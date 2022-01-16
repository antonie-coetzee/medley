import { CMedleyTypes, Host} from "@medley-js/common";
import { ContextMenuStore } from "./ContextMenuStore";
import { DialogStore } from "./DialogStore";
import { CompositeNode } from "../node";
import { ReactFlowStore } from "./ReactFlowStore";
import { EditStore } from "./EditStore";
import { NodeContext } from "@medley-js/core";
import { NodeStore } from "./NodeStore";
import React from "react";
import { MobXProviderContext } from "mobx-react";

const storesKey = Symbol();

export function useStores() {
  return React.useContext(MobXProviderContext) as Stores;
}

export function getStores(context: NodeContext<CompositeNode, CMedleyTypes>, host:Host) : Stores {
  const node = context.node;
  if(node[storesKey] == null){
    node[storesKey] = new Stores(context, host);
  }
  return node[storesKey] as Stores;
}

export class Stores {
  dialogStore:DialogStore;
  contextMenuStore:ContextMenuStore;
  reactFlowStore:ReactFlowStore;
  editStore:EditStore;
  nodeStore:NodeStore;

  constructor(context: NodeContext<CompositeNode, CMedleyTypes>, host:Host) {
    this.nodeStore = new NodeStore(context);
    this.dialogStore = new DialogStore();
    this.editStore = new EditStore(host, this.dialogStore, this.nodeStore);
    this.reactFlowStore = new ReactFlowStore(context, this.editStore, this.nodeStore, host);
    this.contextMenuStore = new ContextMenuStore(context, this.editStore);
  }
}
