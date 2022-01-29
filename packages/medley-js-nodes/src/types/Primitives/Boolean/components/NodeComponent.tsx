import { Handle, Position } from "react-flow-renderer";
import { TNodeComponent } from "@medley-js/common";
import { Box, Chip, Switch } from "@mui/material";
import React from "react";
import { BooleanNode } from "../node";
import { Terminal } from "@/lib/components";

export const NodeComponent: TNodeComponent<BooleanNode> = ({
  context,
  selected,
}) => {

  const node = context.observableNode;
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    node.value = event.target.checked;
  };

  return (
    <Box>
      <Chip
        label={
          <Switch
            checked = {context.node.value || false}
            onChange={handleChange}
            color={"success"}
            inputProps={{ "aria-label": "controlled" }}
          />
        }
        //color={"#0288d1"}
        variant="outlined"
        style={{ borderWidth: "2px", padding: "20px", borderRadius: "100px", borderColor: node.value ? "green" : "grey" }}
        size="small"
      />
      <Terminal id={context.node.id} output={true} style={{
        backgroundColor: node.value ? "green" : "grey"
      }} />
    </Box>
  );
};
