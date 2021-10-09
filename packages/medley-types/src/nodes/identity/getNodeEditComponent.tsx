import React from "react";
import { NodeEditComponent, GetNodeEditComponent } from "medley-common";

import { IdentityNode } from "./node";

const IdentityNodeEditComponent: NodeEditComponent<IdentityNode> = () => {
  return <div></div>;
};

export const getNodeEditComponent: GetNodeEditComponent<IdentityNode> = () => {
  return IdentityNodeEditComponent;
};
