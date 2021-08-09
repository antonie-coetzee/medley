import { NodeChip } from "@/components/util/NodeChip";
import { useStores } from "@/stores/Stores";
import { DnD_Node } from "@/util/types";
import { createStyles, makeStyles, Theme } from "@material-ui/core";
import { Port, Node } from "medley";
import { observer } from "mobx-react";
import React from "react";
import { useDrop } from "react-dnd";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      borderRadius: "5px",
      display: "flex",
      justifyContent: "left",
      flexWrap: "wrap",
      "& > *": {
        margin: theme.spacing(0.5),
      },
    },
  })
);

export const NodePort: React.FC<{ node: Node; port: Port }> = observer(
  ({ node, port }) => {
    const { medley } = useStores();

    const [{ canDrop, isOver }, drop] = useDrop(() => ({
      // The type (or types) to accept - strings or symbols
      accept: DnD_Node,
      // Props to collect
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
      drop: (item: any) => {
        const dropNode = item.node as Node;
        if (dropNode == null) {
          return;
        }
        medley.addLink(dropNode.id, node.id, port.name);
      },
    }));

    const classes = useStyles();
    return (
      <fieldset
        className={classes.root}
        ref={drop}
        style={{ backgroundColor: isOver ? "rgba(0,0,0,0.035)" : "" }}
      >
        <legend>{port.name}</legend>
        {medley.getPortLinks(node.id, port.name)?.map((l, i) => (
          <NodeChip
            node={medley.getNode(l.source)}
            key={i}
            onDelete={() => medley.deleteLink(l)}
          />
        ))}
      </fieldset>
    );
  }
);
