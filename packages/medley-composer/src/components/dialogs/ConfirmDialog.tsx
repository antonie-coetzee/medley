import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Portal,
  TextField,
  Typography,
} from "@material-ui/core";
import { useSnackbar } from "notistack";
import { observer } from "mobx-react";
import React, { useRef, useState } from "react";
import { useStores } from "../../stores/Stores";

const ConfirmDialogComponent = () => {
  const { dialogStore } = useStores();
  const dialogState = dialogStore.confirmDialogState;

  const handleClose = () => {
    dialogStore.closeConfirmDialog();
  };

  const handleOk = () => {
    try{
      dialogState.onOk?.();
    }finally{
      dialogStore.closeConfirmDialog();
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleOk();
    }
  };

  return (
    <Portal>
      <Dialog open={dialogState.isOpen} onClose={handleClose}>
        <DialogTitle>{dialogState.title || "Dialog"}</DialogTitle>
        <DialogContent>
          <Typography>
          {dialogState.content}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleOk} color="primary">
            {dialogState.okButton || "Ok"}
          </Button>
        </DialogActions>
      </Dialog>
    </Portal>
  );
};

export const ConfirmDialog = observer(ConfirmDialogComponent);
