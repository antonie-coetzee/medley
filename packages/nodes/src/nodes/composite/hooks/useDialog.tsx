import * as React from "react";
import Dialog from "@mui/material/Dialog";

export default function useDialog() {
  const [state, setState] = React.useState<{
    open: boolean;
    dialog: React.VFC<{ close: () => void }> | null;
  }>({
    open: false,
    dialog: null,
  });

  const handleClose = () => {
    setState({ open: false, dialog: null });
  };

  return {
    openDialog: (dialog: React.VFC<{ close: () => void }>) => {
      setState({ open: true, dialog });
    },
    Dialog: (
      <Dialog open={state.open} onClose={handleClose}>
        {state.dialog && state.dialog({ close: handleClose })}
      </Dialog>
    ),
  };
}
