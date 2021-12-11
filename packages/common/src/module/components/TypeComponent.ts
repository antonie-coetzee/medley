import { VFC } from "react";
import { BaseContext } from "@medley-js/core";
import { CBaseTypes, Host } from "../../types";

export type TTypeComponentProps = {
  context: BaseContext<CBaseTypes>;
  host: Host;
};

export type TTypeComponent = VFC<TTypeComponentProps>;
