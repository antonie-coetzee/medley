import { BaseContext } from "@medley-js/core";
import { CLink, CNode, CType } from "@medley-js/common";

export function getNodes(context: BaseContext<CNode, CType, CLink>) {
  /* nodes linked to the current scope */
  const linkedNodes = context.medley.links.getSourceLinks(context.medley.scopeId).map((sl) => {
    const linkedNode = context.medley.nodes.getNode(sl.target);
    if (linkedNode) {
      /* use link's position on node */
      return { ...linkedNode, ...sl.position };
    }
  });
  /* nodes belonging to the current scope */
  const scopeNodes = context.medley.nodes.getNodes();
  const mNodes = linkedNodes
    .filter((n) => n !== undefined)
    .concat(...scopeNodes) as CNode[];
  return mNodes;
}
