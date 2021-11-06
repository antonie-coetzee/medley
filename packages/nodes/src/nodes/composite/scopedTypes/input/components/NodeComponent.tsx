import React, { useState } from "react";
import { Handle, Position } from "react-flow-renderer";
import { TNodeComponent } from "@medley-js/common";
import Chip from "@material-ui/core/Chip";
import { InputNode } from "../InputNode";
import ExitToApp from "@mui/icons-material/ExitToApp";
import { Menu, Popover } from "@mui/material";
import { EditNodeComponent } from "./EditNodeComponent";

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
        label={node.name}
        //color={"#0288d1"}
        variant="outlined"
        style={{ borderWidth: "2px", paddingRight: "8px", borderColor: node.value?.color ? node.value?.color : "#0288d1" }}
        size="small"
      />
      <Handle
        id={context.node.id}
        type="source"
        position={Position.Right}
        isConnectable={true}
        style={{
          background: node.value?.color ? node.value.color : "#0288d1" ,
          right: "0px",
          height: "24px",
          border: "none",
          width: "12px",
          borderRadius: "unset",
          borderBottomRightRadius: "12px",
          borderTopRightRadius: "12px",
        }}
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
        <EditNodeComponent context={context} host={host} close={handleClose} />
      </Menu>
    </div>
  );
};
