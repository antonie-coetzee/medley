import { GetNodeComponentProps } from "@medley-js/common";
import { IdentityNode } from "./node";

export const getNodeComponentProps: GetNodeComponentProps<IdentityNode> = async (node) => {
  return {
      dragHandle: ".drag-handle"
  }
};
