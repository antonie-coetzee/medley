import { LinkProps } from "@medley-js/common";
import { Box } from "@mui/material";
import React from "react";
import { getBezierPath } from "react-flow-renderer";

export const DefaultLinkComponent: (props: LinkProps) => JSX.Element = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  selected,
  color,
}) => {
  const edgePath = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <Box
        component={"g"}
        sx={{
          fill: "none",
          ":hover": {
            cursor: "pointer",
          },
          "& .edge-path-selector": {
            stroke: "transparent",
            strokeWidth: 28,
          },
          "& .edge-path": {
            strokeWidth: 3,
            stroke: selected
              ? (theme) => theme.composite.link.selectedStroke
              : (theme) => color || theme.composite.link.stroke,
          },
        }}
      >
        <path className="edge-path-selector" d={edgePath} />
        <path className={`edge-path`} id={id} style={style} d={edgePath} />
      </Box>
    </>
  );
};
