import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@material-ui/core";
import React, { Fragment } from "react";

export interface NewModelDialogProps { }

export const NewModelDialog: React.FC<NewModelDialogProps> = () => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {

  };

  return <Fragment>
    <Button variant="outlined" color="primary" onClick={handleClickOpen}>
      New
    </Button>
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">New Model Name</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Name"
          type="text"
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
          </Button>
        <Button onClick={handleClose} color="primary">
          Subscribe
          </Button>
      </DialogActions>
    </Dialog>
  </Fragment>
}