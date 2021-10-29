import Menu from "@mui/material/Menu";
import { observer } from "mobx-react";
import React from "react";
import { useStores } from "../stores";

export const ContextMenu: React.VFC = observer(() => {
  const { contextMenuStore: cMS } = useStores();
  return (
    <Menu
      open={cMS.contextMenu !== null}
      onClose={cMS.closeContextMenu}
      anchorReference="anchorPosition"
      anchorPosition={cMS.getPosition()}
    >
      {cMS.menuItems &&
        cMS.menuItems.map((MenuItem, i) => (
          <MenuItem
            key={i}
            close={cMS.closeContextMenu}
            mouseX={cMS.contextMenu?.mouseX}
            mouseY={cMS.contextMenu?.mouseY}
          ></MenuItem>
        ))}
    </Menu>
  );
});
