import { DecorateLink } from "@medley-js/common";
import { IdentityNode } from "./node";

export const decorateLink: DecorateLink<IdentityNode> = async (node) => {
  return {
      animated:true
  }
};
