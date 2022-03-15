import { CNodeContext, CType } from "@medley-js/common";
import { Chip, MenuItem } from "@mui/material";
import { makeAutoObservable, observable, toJS } from "mobx";
import React from "react";
import { CompositeNode } from "../node";
import { InputType } from "../scopedTypes/input";
import { EditStore } from "./EditStore";

export type TypeTree = {
  category:(string | URL),
  label?: string,
  order?:number,
  types: (CType | TypeTree)[]
}

export class ContextMenuStore {
  public contextMenu: {
    mouseX: number;
    mouseY: number;
  } | null = null;

  public menuItems: React.VFC<{
    close: () => void;
    mouseX?: number | undefined;
    mouseY?: number | undefined;
  }>[] = [];

  constructor(
    private context: CNodeContext<CompositeNode>,
    private editStore: EditStore
  ) {
    this.menuItems.push(this.menuAddInputNode());
    makeAutoObservable(this, { contextMenu: observable.ref });
  }

  getPosition() {
    if (toJS(this.contextMenu) !== null) {
      return {
        top: this.contextMenu?.mouseY || 0,
        left: this.contextMenu?.mouseX || 0,
      };
    } else {
      return undefined;
    }
  }

  handleContextMenu = (e: React.MouseEvent<Element, MouseEvent>) => {
    e.preventDefault();
    this.contextMenu =
      toJS(this.contextMenu) === null
        ? {
            mouseX: e.clientX,
            mouseY: e.clientY,
          }
        : null;
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

  getTabs(){
    return [{
      category: "",
      types: []
    }]
  }

  menuAddInputNode(): React.VFC<{
    close: () => void;
    mouseX?: number;
    mouseY?: number;
  }> {
    const editStore = this.editStore;
    return ({ close, mouseX, mouseY }) => {
      const allTypes = this.context.compositeScope.types.getTypes();
      const types = allTypes.filter(
        (t) => t.primitive === true && t.volatile !== true
      );
      const inputType = this.context.compositeScope.types.getType(
        InputType.name
      );
      if (inputType) {
        types.push(inputType);
      }
      return (
        <>
          {types.map((type) => {
            return (
              <MenuItem
                key={type.name}
                onClick={async () => {
                  await editStore.createNode(type, [mouseX || 0, mouseY || 0]);
                  close();
                }}
              >
                <Chip
                  label={type.name}
                  color={"primary"}
                  variant="outlined"
                  style={{ borderWidth: "2px" }}
                />
              </MenuItem>
            );
          })}
        </>
      );
    };
  }
}
