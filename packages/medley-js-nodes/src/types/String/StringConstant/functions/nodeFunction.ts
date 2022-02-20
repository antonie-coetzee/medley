import { NF } from "@medley-js/core";
import { StringNode } from "../node";

export const nodeFunction: NF<StringNode> = async (cntx) => {
  return cntx.node.value;
};
