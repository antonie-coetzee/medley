import { GetPorts } from "@medley-js/common";
import { CompositeNode } from "../CompositeNode";

export const getPorts: GetPorts<CompositeNode> = async ({ node }) => {
  return (
    node.value?.inputNodes || []
  );
};
