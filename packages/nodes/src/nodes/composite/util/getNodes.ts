import { BaseContext, NodeContext } from "@medley-js/core";
import { CLink, CMedleyTypes, CNode, CType } from "@medley-js/common";
import { CompositeNode } from "..";

export function getNodes(context: NodeContext<CompositeNode, CMedleyTypes>) {
  /* nodes linked to the current scope */
  const linkedNodes = context.medley.links.getSourceLinks(context.node.id).map((sl) => {
    const linkedNode = context.medley.nodes.getNode(sl.target);
    if (linkedNode) {
      /* use link's position on node */
      return { ...linkedNode, ...sl.position };
    }
  });
  /* nodes belonging to the composite scope */
  const scopeNodes = context.compositeScope.nodes.getNodes();
  const mNodes = linkedNodes
    .filter((n) => n !== undefined)
    .concat(...scopeNodes) as CNode[];
  return mNodes;
}
