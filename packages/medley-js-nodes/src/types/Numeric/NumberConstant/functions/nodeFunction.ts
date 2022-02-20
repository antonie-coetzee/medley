import { NF } from "@medley-js/core";
import { NumberConstantNode } from "../node";

export const nodeFunction: NF<NumberConstantNode> = async (cntx) => {
  return cntx.node.value;
};
