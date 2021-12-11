import { MobXProviderContext } from "mobx-react";
import React from "react";
import { CLink, CNode, CType, Host, TEditNodeComponentProps} from "@medley-js/common";
import { ContextMenuStore } from "./ContextMenuStore";
import { DialogStore } from "./DialogStore";
import { CompositeNode } from "../CompositeNode";
import { ReactFlowStore } from "./ReactFlowStore";
import { EditStore } from "./EditStore";
import { NodeContext } from "@medley-js/core";

export function getStores(params: {context: NodeContext<CompositeNode, CNode, CType, CLink>, host:Host}) {
  return params.context.getNodeStore(()=>new Stores(params.context, params.host)) as Stores;
}

export class Stores {
  dialogStore:DialogStore;
  contextMenuStore:ContextMenuStore;
  reactFlowStore:ReactFlowStore;
  editStore:EditStore;

  constructor(context: NodeContext<CompositeNode, CNode, CType, CLink>, host:Host) {
    this.dialogStore = new DialogStore();
    this.editStore = new EditStore(props, this.dialogStore);
    this.reactFlowStore = new ReactFlowStore(props, this.editStore);
    this.contextMenuStore = new ContextMenuStore(props, this.editStore);
  }
}
