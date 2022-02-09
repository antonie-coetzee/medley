import { TLinkComponent } from "@medley-js/common";
import React from "react";
import { InputNode } from "../InputNode";

export const LinkComponent: TLinkComponent = ({
  context,
  DefaultLinkComponent,
  linkProps,
}) => {
  const node = context.getObservableNode<InputNode>();
  return (
    <DefaultLinkComponent
      {...linkProps}
      style={{
        ...linkProps.style,
        ...{
          stroke: node.value?.color ? node.value.color : "#0288d1",
          strokeWidth: "2px",
          animation: node.value ? "dashdraw .5s linear infinite" : "unset",
          strokeDasharray: node.value ? 5 : 0,
        },
      }}
    />
  );
};
