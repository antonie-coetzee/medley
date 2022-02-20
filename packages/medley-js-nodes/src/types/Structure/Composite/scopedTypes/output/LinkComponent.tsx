import { TLinkComponent } from "@medley-js/common";
import React from "react";
import { OutputNode } from "./node";

export const LinkComponent: TLinkComponent = ({
  context,
  DefaultLinkComponent,
  linkProps,
}) => {
  const node = context.getObservableNode<OutputNode>();
  return <DefaultLinkComponent {...linkProps} color={node?.value?.color} />;
};
