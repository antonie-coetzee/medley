
import Menu from "@mui/material/Menu";
import { observer } from "mobx-react";
import React from "react";
import { useStores } from "../stores";

export const ContextMenu: React.VFC = observer(() => {
  const { contextMenuStore: cMS } = useStores();

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    cMS.openContextMenu(event.clientX, event.clientY);
  };

  return (
    <div onContextMenu={handleContextMenu} style={{ cursor: "context-menu" }}>
        <Menu
        open={cMS.contextMenu !== null}
        onClose={cMS.closeContextMenu}
        anchorReference="anchorPosition"
        anchorPosition={cMS.getPosition()}
        >
        {menuItems && menuItems.map((MenuItem, i) => <MenuItem key={i} close={handleClose} mouseX={contextMenu?.mouseX} mouseY={contextMenu?.mouseY}></MenuItem>)}
        </Menu>
    </div>
  );
});
