import { TLinkComponent } from "@medley-js/common";
import React from "react";
import { BooleanConstantNode } from "../node";

export const LinkComponent: TLinkComponent = ({
  DefaultLinkComponent,
  linkProps,
}) => {
  return <DefaultLinkComponent {...linkProps} color={"green"} />;
};
