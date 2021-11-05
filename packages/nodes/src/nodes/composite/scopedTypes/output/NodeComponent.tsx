import React from "react";
import { Handle, Position } from "react-flow-renderer";
import { TNodeComponent } from "@medley-js/common";
import Chip from "@mui/material/Chip";
import ExitToApp from "@mui/icons-material/ExitToApp";
import { OutputNode } from "./node";

export const NodeComponent: TNodeComponent<OutputNode> = ({
  context: { node },
  selected,
}) => {
  return (
    <>
      <Chip
        label={node.name}
        variant="outlined"
        style={{ borderWidth: "2px" }}
        size="small"
      />
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: "#555" }}
        isConnectable={true}
        id={node.id}
      />
    </>
  );
};
