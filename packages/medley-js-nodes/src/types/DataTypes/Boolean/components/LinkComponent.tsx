import { TLinkComponent } from "@medley-js/common";
import React from "react";
import { BooleanNode } from "../node";

export const LinkComponent: TLinkComponent = ({
  context,
  DefaultLinkComponent,
  linkProps,
}) => {
  const node = context.getObservableNode<BooleanNode>();
  return <DefaultLinkComponent {...linkProps} style={{...linkProps.style, ...{
    stroke: node.value ? "green" : "grey",
    strokeWidth: "2px",
    animation: node.value ? "dashdraw .5s linear infinite" : "unset",
    strokeDasharray: node.value ? 5 : 0,
  }}}/>;
};
