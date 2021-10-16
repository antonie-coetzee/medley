import { GetLinkComponentProps } from "@medley-js/common";
import { IdentityNode } from "./node";

export const getLinkComponentProps: GetLinkComponentProps<IdentityNode> = async (node) => {
  return {
      animated:true
  }
};
