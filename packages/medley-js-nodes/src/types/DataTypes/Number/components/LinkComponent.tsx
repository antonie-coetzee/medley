import { TLinkComponent } from "@medley-js/common";
import React from "react";
import { NumberNode } from "../node";

export const LinkComponent: TLinkComponent = ({
  context,
  DefaultLinkComponent,
  linkProps,
}) => {
  return (
    <DefaultLinkComponent
      {...linkProps}
      style={{
        ...linkProps.style,
        ...{
          stroke: "orange",
          strokeWidth: "2px",
          animation: "dashdraw .5s linear infinite",
          strokeDasharray: 5,
        },
      }}
    />
  );
};
