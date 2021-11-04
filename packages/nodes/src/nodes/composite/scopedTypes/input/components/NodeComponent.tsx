import React, { useState } from "react";
import { Handle, Position } from "react-flow-renderer";
import { TNodeComponent } from "@medley-js/common";
import Chip from "@material-ui/core/Chip";
import { InputNode } from "../InputNode";
import ExitToApp from "@mui/icons-material/ExitToApp";
import { Menu, Popover } from "@mui/material";
import { NodeEditComponent } from "./NodeEditComponent";

export const NodeComponent: TNodeComponent<InputNode> = ({
  context,
  host,
  selected,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);
  const [contextMenu, setContextMenu] = React.useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
          }
        : null
    );
  };

  const { node } = context;

  const handleClose = () => {
    setAnchorEl(null);
    setContextMenu(null);
  };
  const open = Boolean(contextMenu);

  return (
    <div
      onDoubleClick={(e) => {
        setAnchorEl(e.currentTarget);
      }}
      onContextMenu={handleContextMenu}
    >
      <Chip
        icon={<ExitToApp />}
        label={node.name}
        color={"primary"}
        variant={!selected ? "outlined" : undefined}
        style={{ borderWidth: "1px" }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: "#555" }}
        id={node.id}
        isConnectable={true}
      />
      <Menu
        open={contextMenu !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <NodeEditComponent context={context} host={host} close={handleClose} />
      </Menu>
    </div>
  );
};
