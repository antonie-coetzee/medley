import React, { Fragment, useState } from "react";
import { WithToolBar } from "@/components/util/Toolbar";
import { IconButton } from "@material-ui/core";
import { FileCopy, Save } from "@material-ui/icons";

type WithEditToolbarProps = {
  doSave?: () => void;
  doCopy?: () => void;
};

export const WithEditToolbar: React.FC<WithEditToolbarProps> = (props) => {
  return (
    <WithToolBar
      actions={[
        <IconButton
          key={"save"}
          onClick={props.doSave?.call}
        >
          <Save />
        </IconButton>,
        <IconButton
          key={"copy"}
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
