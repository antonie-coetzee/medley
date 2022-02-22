import React from "react";
import { Handle, Position } from "react-flow-renderer";
import { TNodeComponent } from "@medley-js/common";
import Chip from "@mui/material/Chip";
import { OutputNode } from "./node";

export const NodeComponent: TNodeComponent<OutputNode> = ({
  context,
  selected,
}) => {
  const node = context.observableNode;
  return (
    <div style={{position:"relative"}}>
      <Chip
        label={node.name}
        variant="outlined"
        style={{ borderWidth: "2px", paddingLeft: "8px", borderColor: node.value?.color ? node.value?.color : "#bdbdbd" }}
        size="small"
      />
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: node.value?.color ? node.value.color : "#bdbdbd" ,
          left: "0px",
          height: "23px",
          border: "none",
          width: "12px",
          borderRadius: "unset",
          borderBottomLeftRadius: "12px",
          borderTopLeftRadius: "12px",
        }}
        isConnectable={true}
        id={node.id}
      />
    </div>
  );
};
