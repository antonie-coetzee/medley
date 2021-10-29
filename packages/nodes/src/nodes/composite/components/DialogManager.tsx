import { Portal } from "@mui/core";
import { Dialog } from "@mui/material";
import { observer } from "mobx-react";
import React from "react";
import { useStores } from "../stores";

export const DialogManager: React.VFC = observer(() => {
  const { dialogStore } = useStores();

  const handleClose = () => {
    dialogStore.closeDialog();
  };

  return (
    <Portal>
      <Dialog open={dialogStore.open} onClose={handleClose}>
        {dialogStore.dialog && dialogStore.dialog({ close: handleClose })}
      </Dialog>
    </Portal>
  );
});
