import React from "react";
import { ArrowHeadType, getBezierPath, getMarkerEnd, Position } from "react-flow-renderer";
import { TLinkComponent } from "@medley-js/common";
import { BooleanNode } from "../node";

export const LinkComponent: TLinkComponent = ({ context, linkProps:{
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition ,
    targetPosition,
    style,
    arrowHeadType,
    markerEndId,
  } }) => {
    const node = context.observableNode;
    const edgePath = getBezierPath({ sourceX, sourceY, sourcePosition:sourcePosition as Position  , targetX, targetY, targetPosition: targetPosition as  Position});
    const markerEnd = getMarkerEnd(arrowHeadType as ArrowHeadType, markerEndId);
    return (
      <>
        <path id={id} style={{...style, ...{ stroke: node.value? "green" : "grey", strokeWidth: "2px", animation: node.value? "dashdraw .5s linear infinite" : "unset", strokeDasharray: node.value? 5 : 0}}} className="react-flow__edge-path" d={edgePath} markerEnd={markerEnd} />
      </>
    );
  };

