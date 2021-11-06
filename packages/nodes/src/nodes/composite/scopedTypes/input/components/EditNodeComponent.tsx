import { Medley } from "@medley-js/core";
import { TEditNodeComponent } from "@medley-js/common";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import React, { Fragment, useState } from "react";
import { InputNode } from "../InputNode";
import { InputType } from "../type";
import { runInAction } from "mobx";

export const EditNodeComponent: TEditNodeComponent<InputNode> = (props) => {
  const node = props.context.node;
  return (
    <>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Name"
          type="text"
          fullWidth
          variant="standard"
          defaultValue = {node.name}
          onChange={(e) => {         
            runInAction(() => {
              node.name = e.target.value;
            });
          }}
        />
        <input
          className="nodrag"
          type="color"
          onChange={(e) => {
            runInAction(() => {
              node.value.color = e.target.value;
            });
          }}
          defaultValue={node.value.color}
        />
      </DialogContent>
    </>
  );
};
