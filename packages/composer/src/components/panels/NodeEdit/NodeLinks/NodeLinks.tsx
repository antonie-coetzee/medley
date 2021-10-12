import { NodeChip } from "@/components/util/NodeChip";
import { useStores } from "@/stores/Stores";
import { Chip, createStyles, List, ListItem, makeStyles, Theme } from "@material-ui/core";
import { Node } from "medley";
import { observer } from "mobx-react";
import React from "react";
import { NodePort } from "./NodePort";

export const NodeLinks: React.FC<{ node: Node }> = observer((props) => {
  const { medley } = useStores();
  return (
    <List component="nav" aria-label="secondary mailbox folders">
      {medley.getPortsFromType(props.node.type)?.map((p, i) => (
        <ListItem key={i}>
          <NodePort node={props.node} port={p} />
        </ListItem>
      ))}
    </List>
  );
});
