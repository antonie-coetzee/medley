import React from "react";
import { Medley } from "@medley-js/core";
import { CNode, TNodeComponent } from "@medley-js/common";
import { Handle, Position } from "react-flow-renderer";
import { InputType } from "../scopedTypes/input";
import { OutputType } from "../scopedTypes/output";
import { styled } from "@mui/system";
import { Badge, BadgeProps } from "@mui/material";

const StyledDiv = styled("div")(({ theme }) => ({
  translate:"15px",
  height:"20px",
  lineHeight:"20px",
  fontSize:"14px",
  cursor: "default",
  backgroundColor:"#0288d1",
  color:"white",
  paddingLeft:"2px",
  paddingRight:"4px",
  width:"max-content"
}));

function getHandles(medley: Medley<CNode>, node: CNode) {
  const compContext = Medley.getChildInstance(medley, node.id);
  const inputHandles = compContext.nodes
    .getNodesByType(InputType.name)
    .map((n) => {
      return (
        <Handle
          key={n.id}
          type="target"
          position={Position.Left}
          style={{
            background: "#555",
            borderTopLeftRadius: "10px",
            borderBottomLeftRadius: "10px",
            borderBottomRightRadius: "0px",
            borderTopRightRadius: "0px",
            border: "none",
            height: "20px",
            width: "15px",
            translate: "-10px",
            backgroundColor: "#0288d1",
          }}
          isConnectable={true}
          id={n.id}
        >
          <StyledDiv>{n.id}</StyledDiv>
        </Handle>
      );
    });
  const outputHandles = compContext.nodes
    .getNodesByType(OutputType.name)
    .map((n) => {
      return (
        <Handle
          key={n.id}
          type="source"
          position={Position.Right}
          id={n.id}
          style={{ top: 10, background: "#555" }}
          isConnectable={true}
        />
      );
    });
  return [...inputHandles, ...outputHandles];
}

export const NodeComponent: TNodeComponent = ({
  context: { medley, node },
}) => {
  return (
    <>
      {getHandles(medley, node)}
      <div style={{ border: "1px solid black", padding: "200px" }}>
        Composite Node
      </div>
    </>
  );
};
