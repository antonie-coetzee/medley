import { DecorateNodeComponent } from "@medley-js/common";
import { IdentityNode } from "./node";

export const decorateNodeComponent: DecorateNodeComponent<IdentityNode> = async (node) => {
  return {
      dragHandle: ".drag-handle"
  }
};
