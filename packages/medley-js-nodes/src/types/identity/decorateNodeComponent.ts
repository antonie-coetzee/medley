import { DecorateNode } from "@medley-js/common";
import { IdentityNode } from "./node";

export const decorateNode: DecorateNode<IdentityNode> = async (node) => {
  return {
      dragHandle: ".drag-handle"
  }
};
