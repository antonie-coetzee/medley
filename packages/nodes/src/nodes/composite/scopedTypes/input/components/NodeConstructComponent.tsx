import { Medley } from "@medley-js/core";
import { TNodeConstructComponent } from "@medley-js/common";
import { Button, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import React, { Fragment } from "react";
import { InputNode } from "../InputNode";
import { InputType } from "../type";

export const NodeConstructComponent: TNodeConstructComponent<InputNode> = (props) => {
  const node = props.context.node;
  node.name = getDefaultName(props.context.medley);
  node.value = {color:"black"};
  return <Fragment>
      <DialogTitle>Create new input terminal</DialogTitle>
      <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="text"
            fullWidth
            variant="standard"
            defaultValue={node.name}
            onChange={(e)=>{node.name = e.target.value}}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>props.close(false)}>Cancel</Button>
          <Button onClick={()=>props.close(true)}>Create</Button>
        </DialogActions>
  </Fragment>
};

function getDefaultName(medley:Medley){
  const numInputs = medley.nodes.getNodesByType(InputType.name);
  return `Input ${numInputs.length + 1}`;
}
