import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Portal,
  TextField,
} from "@material-ui/core";
import { useSnackbar } from "notistack";
import { observer } from "mobx-react";
import React, { useRef, useState } from "react";
import { useStores } from "../../stores/Stores";

const StringInputDialogComponent = () => {
  const [input, setInput] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const { dialogStore } = useStores();
  const dialogState = dialogStore.stringInputDialogState;

  const handleClose = () => {
    dialogStore.closeStringDialog();
  };

  const nameRef = useRef<HTMLInputElement>();
  const handleOk = () => {
    if (nameRef.current) {
      dialogState.onOk?.(nameRef.current.value);
      if (dialogState.successMessage) {
        enqueueSnackbar(dialogState.successMessage, { variant: "success" });
      }
    }
    dialogStore.closeStringDialog();
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
          <TextField
            autoFocus
            margin="dense"
            label={dialogState.inputLabel || "Input"}
            type="text"
            fullWidth
            onChange={(e)=>setInput(e.target.value)}
            inputRef={nameRef}
            onKeyDown={onKeyDown}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleOk} color="primary" disabled={!input}>
            {dialogState.okButton || "Ok"}
          </Button>
        </DialogActions>
      </Dialog>
    </Portal>
  );
};

export const StringInputDialog = observer(StringInputDialogComponent);
