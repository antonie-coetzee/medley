import React, { Fragment, useState } from "react";
import { WithToolBar } from "@/components/util/Toolbar";
import { IconButton } from "@material-ui/core";
import { FileCopy, Save } from "@material-ui/icons";

type NodeValueToolbarProps = {
  doSave?: () => void;
  doCopy?: () => void;
};

export const NodeValueToolbar: React.FC<NodeValueToolbarProps> = (props) => {
  return (
    <WithToolBar
      actions={[
        <IconButton
          onClick={props.doSave?.call}
        >
          <Save />
        </IconButton>,
        <IconButton
          onClick={props.doCopy?.call}
        >
          <FileCopy />
        </IconButton>
      ]}
    >
      {props.children}
    </WithToolBar>

  );
};
