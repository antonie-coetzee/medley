import { EditNode } from "@medley-js/common";
import React from "react";
import { EditNodeComponent } from "../components";
import { InputNode } from "../InputNode";

export const editNode: EditNode<InputNode> = async (context, host) => {
  host.displayPopover?.call(this, () => (
    <EditNodeComponent host={host} context={context} />
  ));
};
