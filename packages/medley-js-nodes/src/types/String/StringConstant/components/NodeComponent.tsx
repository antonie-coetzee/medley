import { Terminal } from "@/lib/components";
import { TNodeComponent } from "@medley-js/common";
import { Box, TextField } from "@mui/material";
import { runInAction } from "mobx";
import React from "react";
import { StringNode } from "../node";

export const NodeComponent: TNodeComponent<StringNode> = ({ context }) => {
  const node = context.observableNode;
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    runInAction(() => {
      node.value = event.target.value;
    });
  };

  return (
    <Box>
      <TextField
        multiline
        value={node.value}
        onChange={handleChange}
        sx={{
          backgroundColor:"lavenderblush"
        }}
      />
      <Terminal
        id={context.node.id}
        output={true}
        style={{
          backgroundColor: "Magenta",
          right: "-6px",
        }}
      />
    </Box>
  );
};
