import * as React from "react";
import Menu from "@mui/material/Menu";

export default function useContextMenu(
  menuItems?: React.VFC<{ close: () => void, mouseX?:number, mouseY?:number }>[]
) {
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

  const handleClose = () => {
    setContextMenu(null);
  };

  return {
    ContextMenu: menuItems && (
      <div onContextMenu={handleContextMenu} style={{ cursor: "context-menu" }}>
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
          {menuItems && menuItems.map((MenuItem, i) => <MenuItem key={i} close={handleClose} mouseX={contextMenu?.mouseX} mouseY={contextMenu?.mouseY}></MenuItem>)}
        </Menu>
      </div>
    ),
    handleContextMenu,
  };
}
