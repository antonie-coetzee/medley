import { NF } from "@medley-js/core";
import { BooleanConstantNode } from "../node";

export const nodeFunction: NF<BooleanConstantNode> = async (cntx) => {
  return cntx.node.value;
};
