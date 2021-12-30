import { VFC } from "react";
import { BaseContext } from "@medley-js/core";
import { CMedleyTypes, Host } from "../../types";

export type TTypeComponentProps = {
  context: BaseContext<CMedleyTypes>;
  host: Host;
};

export type TTypeComponent = VFC<TTypeComponentProps>;
