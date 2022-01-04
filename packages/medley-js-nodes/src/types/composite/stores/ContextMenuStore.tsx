import { NodeContext } from "@medley-js/core";
import { ExitToApp } from "@mui/icons-material";
import { Chip, MenuItem } from "@mui/material";
import { makeAutoObservable, observable, toJS } from "mobx";
import React from "react";
import { CompositeNode } from "../CompositeNode";
import { InputType } from "../scopedTypes/input";
import { EditStore } from "./EditStore";

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
    private context: NodeContext<CompositeNode>,
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

  menuAddInputNode(): React.VFC<{
    close: () => void;
    mouseX?: number;
    mouseY?: number;
  }> {
    const editStore = this.editStore;
    return ({ close, mouseX, mouseY }) => {
      const addInput = async () => {
        await editStore.createNode(InputType, [mouseX || 0, mouseY || 0]);
        close();
      };
      return (
        <MenuItem onClick={addInput}>
          <Chip
            icon={<ExitToApp />}
            label="INPUT"
            color={"primary"}
            variant="outlined"
            style={{ borderWidth: "2px" }}
          />
        </MenuItem>
      );
    };
  }
}
