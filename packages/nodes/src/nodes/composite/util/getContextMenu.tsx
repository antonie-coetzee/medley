import { NodeContext } from "@medley-js/core";
import { CLink, CNode, CType, NodeEditComponentProps } from "@medley-js/common";
import React from "react";
import { CompositeNode } from "../node";
import { Connection, Edge, Node as RFNode } from "react-flow-renderer";
import { Chip, ListItemIcon, MenuItem } from "@mui/material";
import { InputType } from "../terminals/input/type";
import { ExitToApp } from "@mui/icons-material";
import { OutputType } from "../terminals/output/type";

function getAddInputNode(
  context: NodeContext<CompositeNode, CNode, CType, CLink>
): React.VFC<{ close: () => void; mouseX?: number; mouseY?: number }> {
  return ({ close, mouseX, mouseY }) => {
    const addInput = () => {
      const node = context.medley.nodes.upsertNode({
        name: "INPUT",
        type: InputType.name,
      });
      if (mouseX && mouseY) {
        node.position = { x: mouseX, y: mouseY };
      }

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

function getAddOutputNode(
  context: NodeContext<CompositeNode, CNode, CType, CLink>
): React.VFC<{ close: () => void; mouseX?: number; mouseY?: number }> {
  return ({ close, mouseX, mouseY }) => {
    const addOutput = () => {
      const node = context.medley.nodes.upsertNode({
        name: "OUTPUT",
        type: OutputType.name,
      });
      if (mouseX && mouseY) {
        node.position = { x: mouseX, y: mouseY };
      }

      close();
    };
    return (
      <MenuItem onClick={addOutput}>
        {" "}
        <Chip
          icon={<ExitToApp />}
          label="OUTPUT"
          color="secondary"
          variant="outlined"
          style={{ borderWidth: "2px" }}
        />
      </MenuItem>
    );
  };
}

export function getContextMenu(
  context: NodeContext<CompositeNode, CNode, CType, CLink>
) {
  return [getAddInputNode(context), getAddOutputNode(context)];
}
