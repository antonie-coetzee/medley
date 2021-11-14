import { VFC } from "react";
import { BaseContext } from "@medley-js/core";
import { CLink, CNode, CType, Host } from "../types";

export type TTypeComponentProps = {
  context: BaseContext<CNode, CType, CLink>;
  host: Host;
};

export type TTypeComponent = VFC<TTypeComponentProps>;
