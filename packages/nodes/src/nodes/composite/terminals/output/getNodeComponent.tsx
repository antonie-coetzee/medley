import React from "react";
import { Handle, Position } from "react-flow-renderer";
import { GetNodeComponent } from "@medley-js/common";
import Chip from "@mui/material/Chip";
import ExitToApp from "@mui/icons-material/ExitToApp";
import { OutputNode } from "./node";

export const getNodeComponent: GetNodeComponent<OutputNode> = async () => {
  return ({ node, selected }) => {
    return (
      <>
        <Chip
          icon={<ExitToApp />}
          label={node.name}
          color="secondary"
          variant={!selected ? "outlined" : undefined}
          style={{ borderWidth: "2px" }}
        />
        <Handle
          type="target"
          position={Position.Left}
          style={{ background: "#555" }}
          isConnectable={true}
          id="output"
        />
      </>
    );
  };
};