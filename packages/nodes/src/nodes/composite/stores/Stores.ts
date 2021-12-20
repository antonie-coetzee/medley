import { CMedleyTypes, Host} from "@medley-js/common";
import { ContextMenuStore } from "./ContextMenuStore";
import { DialogStore } from "./DialogStore";
import { CompositeNode } from "../CompositeNode";
import { ReactFlowStore } from "./ReactFlowStore";
import { EditStore } from "./EditStore";
import { NodeContext } from "@medley-js/core";
import { NodeStore } from "./NodeStore";
import React from "react";
import { MobXProviderContext } from "mobx-react";

export const nodeStoreKey = Symbol();
export const storesKey = Symbol();

export function useStores() {
  return React.useContext(MobXProviderContext) as Stores;
}

export function getNodeStore(context: NodeContext<CompositeNode, CMedleyTypes>) {
  return context.getNodeMetadata(nodeStoreKey, NodeStore.Provider);
}

export function getStores(context: NodeContext<CompositeNode, CMedleyTypes>, host:Host) {
  return context.getNodeMetadata(storesKey, ()=>new Stores(context, host));
}

export class Stores {
  dialogStore:DialogStore;
  contextMenuStore:ContextMenuStore;
  reactFlowStore:ReactFlowStore;
  editStore:EditStore;

  constructor(context: NodeContext<CompositeNode, CMedleyTypes>, host:Host) {
    this.dialogStore = new DialogStore();
    this.editStore = new EditStore(context, host, this.dialogStore);
    this.reactFlowStore = new ReactFlowStore(context, this.editStore, host);
    this.contextMenuStore = new ContextMenuStore(context, this.editStore);
  }
}
