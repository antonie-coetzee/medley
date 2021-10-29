import { MobXProviderContext } from "mobx-react";
import React from "react";
import { TNodeEditComponentProps} from "@medley-js/common";
import { ContextMenuStore } from "./ContextMenuStore";
import { DialogStore } from "./DialogStore";
import { CompositeNode } from "../CompositeNode";
import { ReactFlowStore } from "./ReactFlowStore";

export function useStores() {
  return React.useContext(MobXProviderContext) as Stores;
}

export class Stores {
  dialogStore:DialogStore;
  contextMenuStore:ContextMenuStore;
  reactFlowStore:ReactFlowStore;

  constructor(props: TNodeEditComponentProps<CompositeNode>) {
    this.dialogStore = new DialogStore();
    this.reactFlowStore = new ReactFlowStore(props);
    this.contextMenuStore = new ContextMenuStore(props, this.reactFlowStore);
  }
}
