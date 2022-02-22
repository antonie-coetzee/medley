import { EditNode } from "@medley-js/common";
import React from "react";
import { EditNodeComponent } from "./EditNodeComponent";
import { OutputNode } from "./node";

export const editNode: EditNode<OutputNode> = async (context, host) => {
  host.displayPopover?.call(this, () => (
    <EditNodeComponent host={host} context={context} />
  ));
};
