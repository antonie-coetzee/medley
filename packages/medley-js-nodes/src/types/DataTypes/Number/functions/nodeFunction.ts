import { NF } from "@medley-js/core";
import { NumberNode } from "../node";

export const nodeFunction: NF<NumberNode> = async (cntx) => {
  return cntx.node.value;
};
