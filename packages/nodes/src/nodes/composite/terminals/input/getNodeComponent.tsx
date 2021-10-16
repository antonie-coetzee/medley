import React from "react";
import { Handle, Position } from "react-flow-renderer";
import { GetNodeComponent } from "@medley-js/common";
import Chip from "@material-ui/core/Chip";
import { InputNode } from "./node";
import ExitToApp from "@mui/icons-material/ExitToApp";

export const getNodeComponent: GetNodeComponent<InputNode> = async () => {
  return ({node, selected}) => {
    return (
      <>
        <Chip icon={<ExitToApp />} label={node.name} color={"primary"} variant={!selected ? "outlined" : undefined} style={{borderWidth: "2px"}}/>
        <Handle
          type="source"
          position={Position.Right}
          style={{ background: "#555" }}
          isConnectable={true}
        />
      </>
    );
  };
};
