import React from "react";
import { TNodeComponent } from "@medley-js/common";
import { BooleanNode } from "../node";
import { Switch } from "@mui/material";

export const NodeComponent: TNodeComponent<BooleanNode> = ({
  context,
}) => {
  

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    context.node.value = event.target.checked;
  };

  return (
    <Switch
      checked={context.node.value || false}
      onChange={handleChange}
      inputProps={{ "aria-label": "controlled" }}
    />
  );
};
