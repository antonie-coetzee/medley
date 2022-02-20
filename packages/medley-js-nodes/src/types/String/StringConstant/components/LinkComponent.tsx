import { TLinkComponent } from "@medley-js/common";
import React from "react";

export const LinkComponent: TLinkComponent = ({
  DefaultLinkComponent,
  linkProps,
}) => {
  return <DefaultLinkComponent {...linkProps} color={"Magenta"} />;
};
