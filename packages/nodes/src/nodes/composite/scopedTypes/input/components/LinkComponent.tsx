import React from "react";
import { ArrowHeadType, getBezierPath, getMarkerEnd, Position } from "react-flow-renderer";
import { TLinkComponent } from "@medley-js/common";
import { InputNode } from "../InputNode";


export const LinkComponent: TLinkComponent<InputNode> = ({ context:{node}, linkProps:{
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition ,
    targetPosition,
    style,
    data,
    arrowHeadType,
    markerEndId,
  } }) => {
    const edgePath = getBezierPath({ sourceX, sourceY, sourcePosition:sourcePosition as Position  , targetX, targetY, targetPosition: targetPosition as  Position});
    const markerEnd = getMarkerEnd(arrowHeadType as ArrowHeadType, markerEndId);
    console.log("updated")
    return (
      <>
        <path id={id} style={{...style, ...{ stroke: node.value?.color ? node.value?.color : "#0288d1", strokeWidth: "2px"}}} className="react-flow__edge-path" d={edgePath} markerEnd={markerEnd} />
      </>
    );
  };

