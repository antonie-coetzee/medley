import React from "react";
import { TNodeComponent } from "@medley-js/common";
import { BooleanNode } from "../node";
import { Switch } from "@mui/material";
import { NodeContainer } from "@/lib/components/NodeContainer";

export const NodeComponent: TNodeComponent<BooleanNode> = ({
  context,
  selected
}) => {
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    context.node.value = event.target.checked;
  };

  return (
    <Switch
      defaultChecked={context.node.value}
      onChange={handleChange}
      inputProps={{ "aria-label": "controlled" }}
    />   
  );
};
