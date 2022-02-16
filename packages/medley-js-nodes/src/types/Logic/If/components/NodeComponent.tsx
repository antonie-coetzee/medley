import { Handle } from "@/lib/components";
import { TNodeComponent } from "@medley-js/common";
import { QuestionMark } from "@mui/icons-material";
import { Box, Paper } from "@mui/material";
import React from "react";
import { IfNode } from "../node";

export const NodeComponent: TNodeComponent<IfNode> = (props) => {
  const id = props.context.node.id;
  return (
    <Paper
      variant="outlined"
      sx={{
        backgroundColor: "lightyellow",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          padding: "none",
        }}
      >
        <QuestionMark />
      </Box>
      <Handle
        output
        id={"output"}
        color={"black"}
        handleStyle={{
          position: "absolute",
          top: "57%",
        }}
      />
      <Handle id={"true"} color={"green"} label={"true"} />
      <Handle id={"select"} label={"select"} />
      <Handle id={"false"} color={"grey"} label={"false"} />
    </Paper>
  );
};
