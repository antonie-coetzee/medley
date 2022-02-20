import { Terminal } from "@/lib/components";
import { TNodeComponent } from "@medley-js/common";
import { Box, Paper, Switch } from "@mui/material";
import { runInAction } from "mobx";
import React from "react";
import { BooleanConstantNode } from "../node";

export const NodeComponent: TNodeComponent<BooleanConstantNode> = ({
  context,
  selected,
}) => {
  const node = context.observableNode;
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    runInAction(() => {
      node.value = event.target.checked;
    });
  };

  return (
    <Box>
      <Paper
        variant="outlined"
        sx={{
          backgroundColor: "honeydew",
        }}
      >
        <Switch
          checked={context.node.value || false}
          onChange={handleChange}
          color={"success"}
          inputProps={{ "aria-label": "controlled" }}
        />
      </Paper>
      <Terminal
        id={context.node.id}
        output={true}
        style={{
          backgroundColor: node.value ? "green" : "grey",
        }}
      />
    </Box>
  );
};
