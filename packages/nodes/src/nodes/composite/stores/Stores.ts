import { MobXProviderContext } from "mobx-react";
import React from "react";
import { ContextMenuStore } from "./ContextMenuStore";
import { DialogStore } from "./DialogStore";

export function useStores() {
  return React.useContext(MobXProviderContext) as Stores;
}

export class Stores {
  dialogStore:DialogStore;
  contextMenuStore:ContextMenuStore;

  constructor() {
    this.dialogStore = new DialogStore();
    this.contextMenuStore = new ContextMenuStore();
  }
}
