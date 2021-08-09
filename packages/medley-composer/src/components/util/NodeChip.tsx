import { Chip, createStyles, makeStyles, Theme } from "@material-ui/core";
import { Node } from "medley";
import React from "react";
import ColorHash from "color-hash";
import { useDrag } from "react-dnd";
import { DnD_Node } from "@/util/types";

const borderColorHash = new ColorHash({ saturation: 0.5 });
const backgroundColorHash = new ColorHash({ saturation: 0.5, lightness: 0.95 });

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      borderWidth: "2px",
    },
  })
);

export const NodeChip: React.FC<{ node: Node; onDelete?: () => void }> = ({
  node,
  onDelete,
}) => {
  const [collected, drag, dragPreview] = useDrag(() => ({
    type: DnD_Node,
    item: { node },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }));

  const borderColor = borderColorHash.hex(node.type);
  const backgroundColor = backgroundColorHash.hex(node.type);
  const classes = useStyles({ colorHash: borderColor });

  return <Chip
      ref={drag}
      label={node.name || node.id}
      variant="outlined"
      size="medium"
      onDelete={onDelete}
      className={classes.root}
      style={{ borderColor: borderColor, backgroundColor: backgroundColor }}
    />
};
