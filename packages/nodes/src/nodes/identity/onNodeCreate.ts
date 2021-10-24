import { OnNodeCreate } from "@medley-js/common";
import { IdentityNode } from "./node";

export const onNodeCreate: OnNodeCreate<IdentityNode> = async (cntx) => {
  return { slider: 50 };
};
