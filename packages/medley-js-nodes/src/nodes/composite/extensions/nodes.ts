import { NodePart } from "@medley-js/core";
import { CNode } from "@medley-js/common";

export const onNodesChange = Symbol("onNodesChange");
export const onNodeInsert = Symbol("onNodeInsert");

declare module "@medley-js/core" {
  interface Nodes {
    [onNodesChange]?: () => void;
    [onNodeInsert]?: <TNode extends CNode>(nodePart:NodePart<TNode>) => NodePart<TNode>;
  }
}
