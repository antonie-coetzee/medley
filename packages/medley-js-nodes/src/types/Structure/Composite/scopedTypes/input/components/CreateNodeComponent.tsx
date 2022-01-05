import { Medley } from "@medley-js/core";
import { CMedleyTypes, TCreateNodeComponent } from "@medley-js/common";
import { Button, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import React, { Fragment } from "react";
import { InputNode } from "../InputNode";
import { inputTypeName } from "../typeName";

export const CreateNodeComponent: TCreateNodeComponent<InputNode> = (props) => {
  const nodePart = props.context.nodePart;
  nodePart.name = getDefaultName(props.context.medley);
  nodePart.value = {color:"black"};
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
            defaultValue={nodePart.name}
            onChange={(e)=>{nodePart.name = e.target.value}}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>props.close(false)}>Cancel</Button>
          <Button onClick={()=>props.close(true)}>Create</Button>
        </DialogActions>
  </Fragment>
};

function getDefaultName(medley:Medley<CMedleyTypes>){
  const numInputs = medley.nodes.getNodes().filter(n=>n.type === inputTypeName);
  return `Input ${numInputs.length + 1}`;
}
