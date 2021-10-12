import React, { memo } from "react";
import { Handle, Position } from "react-flow-renderer";
import { GetNodeComponent } from "medley-common";
import { IdentityNode } from "./node";

export const getNodeComponent: GetNodeComponent = async () => {
  return ({node}) => {
    return (
      <>
        <Handle
          type="target"
          position={Position.Left}
          style={{ background: "#555" }}
          onConnect={(params) => console.log("handle onConnect", params)}
          isConnectable={true}
        />
        <div style={ {border: '1px solid #777', padding: 10} }>
          {node.name}
        </div>
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
