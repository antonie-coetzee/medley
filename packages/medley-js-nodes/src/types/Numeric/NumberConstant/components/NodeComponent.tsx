import { Terminal } from "@/lib/components";
import { TNodeComponent } from "@medley-js/common";
import { Box, TextField } from "@mui/material";
import { runInAction } from "mobx";
import React from "react";
import { NumberConstantNode } from "../node";
import css from '@emotion/css'

export const NodeComponent: TNodeComponent<NumberConstantNode> = ({
  context,
}) => {
  const node = context.observableNode;
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    runInAction(() => {
      node.value = event.target.value;
    });
  };

  return (
    <Box>
      <div className={css({backgroundColor: "blue"}).name}></div>
      <TextField
        value={node.value}
        onChange={handleChange}
        inputProps={{ type: "number" }}
        sx={{
          backgroundColor: "cornsilk",
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
