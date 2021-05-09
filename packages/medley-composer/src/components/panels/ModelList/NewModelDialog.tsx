import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import { AddCircleOutline } from "@material-ui/icons";
import React, { Fragment, useRef } from "react";

export const NewModelDialog = (doCreate: (name: string) => void) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const nameRef = useRef<HTMLInputElement>();
  const handleCreate = () => {
    if (nameRef.current) {
      doCreate(nameRef.current.value);
    }
    setOpen(false);
  };

  const onKeyDown = (e:React.KeyboardEvent<HTMLInputElement>)=>{
    if(e.key === "Enter"){
      e.preventDefault();
      handleCreate();
    }
  }

  return (
    <Fragment>
      <Button
        type="button"
        color="default"
        size="small"
        variant="outlined"
        startIcon={<AddCircleOutline />}
        onClick={handleClickOpen}
      >
        New
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="NewModel-dialog-title"
      >
        <DialogTitle id="NewModel-dialog-title">New Model</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="text"
            fullWidth
            inputRef={nameRef}
            onKeyDown={onKeyDown}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreate} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};
