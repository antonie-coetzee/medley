import { MobXProviderContext } from "mobx-react";
import React from "react";
import { TEditNodeComponentProps} from "@medley-js/common";
import { ContextMenuStore } from "./ContextMenuStore";
import { DialogStore } from "./DialogStore";
import { CompositeNode } from "../CompositeNode";
import { ReactFlowStore } from "./ReactFlowStore";
import { EditStore } from "./EditStore";

export function useStores() {
  return React.useContext(MobXProviderContext) as Stores;
}

export class Stores {
  dialogStore:DialogStore;
  contextMenuStore:ContextMenuStore;
  reactFlowStore:ReactFlowStore;
  editStore:EditStore;

  constructor(props: TEditNodeComponentProps<CompositeNode>) {
    this.dialogStore = new DialogStore();
    this.editStore = new EditStore(props, this.dialogStore);
    this.reactFlowStore = new ReactFlowStore(props, this.editStore);
    this.contextMenuStore = new ContextMenuStore(props, this.editStore);
  }
}
