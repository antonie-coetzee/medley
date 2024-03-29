import { TLinkComponent } from "@medley-js/common";
import React from "react";
import { InputNode } from "../InputNode";

export const LinkComponent: TLinkComponent = ({
  context,
  DefaultLinkComponent,
  linkProps,
}) => {
  const node = context.getObservableNode<InputNode>();
  return <DefaultLinkComponent {...linkProps} color={node?.value?.color} />;
};
