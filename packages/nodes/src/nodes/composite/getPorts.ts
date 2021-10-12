import { GetPorts } from "medley-common";
import { CompositeNode } from "./node";

export const getPorts: GetPorts<CompositeNode> = ({ node }) => {
  return (
    node.value?.inputNodes || []
  );
};
