import { MenuItem } from "@mui/material";
import { TNodeEditComponentProps } from "@medley-js/common";
import { makeAutoObservable, observable, runInAction, toJS } from "mobx";
import { CompositeNode } from "../CompositeNode";
import { getContextMenu } from "../util";
import { ReactFlowStore } from "./ReactFlowStore";

export class ContextMenuStore {
  public contextMenu: {
    mouseX: number;
    mouseY: number;
  } | null = null;

  public menuItems:
    | React.VFC<{
        close: () => void;
        mouseX?: number | undefined;
        mouseY?: number | undefined;
      }>[]
    | null = null;

  constructor(private props: TNodeEditComponentProps<CompositeNode>, private reactFlowStore: ReactFlowStore) {
    makeAutoObservable(this, { contextMenu: observable.ref });
    this.setContextMenu(getContextMenu(props.context))
  }

  getPosition() {
    if(toJS(this.contextMenu) !== null){
      const position = this.reactFlowStore.reactFlowInstance?.project({x:this.contextMenu?.mouseX || 0 , y:this.contextMenu?.mouseY || 0})
      return { top: position?.y || 0, left: position?.x || 0 }
    }else{
      return undefined;
    }
  }

  handleContextMenu = (e: React.MouseEvent<Element, MouseEvent>) => {
    e.preventDefault();
    this.contextMenu = toJS(this.contextMenu) === null ? {
        mouseX: e.clientX,
        mouseY: e.clientY,
      } : null
  };

  closeContextMenu = () => {
    this.contextMenu = null;
  };

  setContextMenu(
    menuItems: React.VFC<{
      close: () => void;
      mouseX?: number;
      mouseY?: number;
    }>[]
  ): void {
    this.menuItems = menuItems;
  }
}
