import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core";
import {TreeView} from "@material-ui/lab";
import {ExpandMore} from "@material-ui/icons";
import {ChevronRight} from "@material-ui/icons";
import {TreeItem} from "@material-ui/lab";
import { Stores, useStores } from "../../../stores/Stores";
import { Type } from "medley";
import { Observer, observer } from "mobx-react";
import { LayoutStore } from "../../../stores/LayoutStore";

const useStyles = makeStyles({
  root: {
    height: 240,
    flexGrow: 1,
    maxWidth: 400,
  },
});

let nodeId = 0;

export function TypeExplorer() {
  const stores = useStores();
  nodeId = 0;
  return (
    <Observer>
      {() => (
        <TreeView
          defaultCollapseIcon={<ExpandMore />}
          defaultExpandIcon={<ChevronRight />}
        >
        </TreeView>
      )}
    </Observer>
  );
}
