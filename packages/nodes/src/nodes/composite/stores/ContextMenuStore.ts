import { makeAutoObservable } from "mobx";

export class ContextMenuStore {
  public contextMenu: {
    mouseX: number;
    mouseY: number;
  } | null = null;

  public menuItems:(() => JSX.Element)[] | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  getPosition() {
    return this.contextMenu !== null
      ? { top: this.contextMenu.mouseY, left: this.contextMenu.mouseX }
      : undefined;
  }

  openContextMenu = (x: number, y: number) => {
    this.contextMenu === null
      ? {
          mouseX: x - 2,
          mouseY: y - 4,
        }
      : null;
  };

  closeContextMenu = () => {
    this.contextMenu = null;
  };

  setContextMenu(menuItems:(() => JSX.Element)[]):void {
    this.menuItems = menuItems;
  }
}
