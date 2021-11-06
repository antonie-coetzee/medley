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
        style={{ borderWidth: "2px", paddingLeft: "8px" }}
        size="small"
      />
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: "#bdbdbd",
          left: "0px",
          height: "24px",
          border: "none",
          width: "12px",
          borderRadius: "unset",
          borderBottomLeftRadius: "12px",
          borderTopLeftRadius: "12px",
        }}
        isConnectable={true}
        id={node.id}
      />
    </>
  );
};
