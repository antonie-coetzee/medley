import React from "react";
import { TNodeComponent } from "@medley-js/common";
import { NumberNode } from "../node";
import { runInAction } from "mobx";
import { Box, TextField } from "@mui/material";
import { Terminal } from "@/lib/components";

export const NodeComponent: TNodeComponent<NumberNode> = ({ context }) => {
  const node = context.observableNode;
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    runInAction(() => {
        node.value = event.target.value;
    });
  };

  return (
    <Box>
      <TextField
        value={node.value}
        onChange={handleChange}
        inputProps={{ type: 'number'}}
        sx={{
          backgroundColor:"cornsilk"
        }}
      />
      <Terminal
        id={context.node.id}
        output={true}
        style={{
          backgroundColor: "orange",
          right: "-6px",
        }}
      />
    </Box>
  );
};
