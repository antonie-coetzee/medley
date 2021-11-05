import React from "react";
import { ArrowHeadType, getBezierPath, getMarkerEnd, Position } from "react-flow-renderer";
import { TLinkComponent } from "@medley-js/common";

import { CompositeNode } from "../CompositeNode";

export const LinkComponent: TLinkComponent<CompositeNode> = ({ context:{node}, linkProps:{
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition ,
    targetPosition,
    style = {},
    data,
    arrowHeadType,
    markerEndId,
  } }) => {
    const edgePath = getBezierPath({ sourceX, sourceY, sourcePosition:sourcePosition as Position  , targetX, targetY, targetPosition: targetPosition as  Position});
    const markerEnd = getMarkerEnd(arrowHeadType as ArrowHeadType, markerEndId);
    return (
      <>
        <path id={id} style={style} className="react-flow__edge-path" d={edgePath} markerEnd={markerEnd} />
        <text>
            <textPath href={`#${id}`} style={{ fontSize: '12px', marginBottom:"2px" }} startOffset="50%" textAnchor="middle">
            {data?.source}
            </textPath>
        </text>
      </>
    );
  };

