import { Medley } from "@medley-js/core";
import { TNodeEditComponent } from "@medley-js/common";
import { Button, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import React, { Fragment, useState } from "react";
import { InputNode } from "../InputNode";
import { InputType } from "../type";

export const NodeEditComponent: TNodeEditComponent<InputNode> = (props) => {
  const node = props.context.node;
  return <Fragment>
      <DialogTitle>Change input terminal name</DialogTitle>
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
          <Button onClick={()=>props.close()}>Close</Button>
        </DialogActions>
  </Fragment>
};
