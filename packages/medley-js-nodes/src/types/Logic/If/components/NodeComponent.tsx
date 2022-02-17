import { Handle } from "@/lib/components";
import { TNodeComponent } from "@medley-js/common";
import { QuestionMark } from "@mui/icons-material";
import { Box, Paper } from "@mui/material";
import React from "react";
import { IfNode } from "../node";
import { falsePort, selectPort, truePort } from "../ports";

export const NodeComponent: TNodeComponent<IfNode> = (props) => {
  return (
    <Paper
      variant="outlined"
      sx={{
        backgroundColor: "ivory",
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
        portId={props.context.node.id}
        color={"black"}
        handleStyle={{
          position: "absolute",
          top: "57%",
        }}
      />
      <Handle portId={truePort.id} color={"green"} label={"true"} />
      <Handle portId={selectPort.id} label={"select"} />
      <Handle portId={falsePort.id} color={"grey"} label={"false"} />
    </Paper>
  );
};
