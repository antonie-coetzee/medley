export type Info = {};

export type SideBarContainer = {};

export type SideBar = {};

export type EditView = {};

export type Panel = {};

export type Extension = {
  info: Info;
  sideBar?: SideBar;
  sideBarContainer?: SideBarContainer;
  editView?: EditView;
  panel?: Panel;
};
