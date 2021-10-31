import { Chip, MenuItem } from "@mui/material";
import { TNodeEditComponentProps } from "@medley-js/common";
import { makeAutoObservable, observable, runInAction, toJS } from "mobx";
import { CompositeNode } from "../CompositeNode";
import { getContextMenu } from "../util";
import { ReactFlowStore } from "./ReactFlowStore";
import { EditStore } from "./EditStore";
import React from "react";
import { ExitToApp } from "@mui/icons-material";
import { InputType } from "../terminals/input/type";

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
    private props: TNodeEditComponentProps<CompositeNode>,
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
