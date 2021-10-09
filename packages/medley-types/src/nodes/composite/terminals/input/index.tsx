import { NodeEditComponent, GetNodeEditComponent } from "medley-common";
import React from "react";



const IdentityNodeEditComponent: NodeEditComponent = () => {
  return <div></div>;
};

export const getNodeEditComponent: GetNodeEditComponent = () => {
  return IdentityNodeEditComponent;
};
