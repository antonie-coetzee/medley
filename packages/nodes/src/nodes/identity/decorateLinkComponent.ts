import { DecorateLinkComponent } from "@medley-js/common";
import { IdentityNode } from "./node";

export const decorateLinkComponent: DecorateLinkComponent<IdentityNode> = async (node) => {
  return {
      animated:true
  }
};
