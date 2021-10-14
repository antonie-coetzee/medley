import React from "react";

import { GetNodeComponent } from "@medley-js/common";
import { Handle, Position } from "react-flow-renderer";

export const getNodeComponent: GetNodeComponent = async () => {
  return () => {
    return (
      <>
        <Handle
          type="target"
          position={Position.Left}
          style={{ background: "#555" }}
          onConnect={(params) => console.log("handle onConnect", params)}
          isConnectable={true}
        />
        <div>
          Custom Color Picker Node:
        </div>
        <input
          className="nodrag"
          type="color"
        />
        <Handle
          type="source"
          position={Position.Right}
          id="a"
          style={{ top: 10, background: "#555" }}
          isConnectable={true}
        />
      </>
    );
  };
};
