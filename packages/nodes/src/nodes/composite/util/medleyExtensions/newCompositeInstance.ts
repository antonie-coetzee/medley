import { Links, Medley, Nodes, Types } from "@medley-js/core";
import { CLink, CNode, CType, chainObjects } from "@medley-js/common";

export const newCompositeInstance = Symbol("newCompositeInstance");

declare module "@medley-js/core" {
  interface Medley {
    [newCompositeInstance]: (compositeNodeId: string) => Medley;
  }
}

Medley.prototype[newCompositeInstance] = function (
  this: Medley<CNode, CType, CLink>,
  compositeNodeId: string
) {
  const parent = this;
  const scopedNodes = new Nodes<CNode>(compositeNodeId, parent.nodeRepository);
  const scopedTypes = new Types<CType>(compositeNodeId, parent.typeRepository);
  const scopedLinks = new Links<CLink>(compositeNodeId, parent.linkRepository);

  const compositeInstance = new Medley({
    scopeId: compositeNodeId,
    nodeRepository: parent.nodeRepository,
    typeRepository: parent.typeRepository,
    linkRepository: parent.linkRepository,
    loader: parent.loader,
    cache: parent.cache,
    types: chainObjects<Types<CType>, Partial<Types<CType>>>(scopedTypes, {
      getType: (typeName) => {
        const type = scopedTypes.getType(typeName);
        if (type) {
          return type;
        } else {
          return parent.types.getType(typeName);
        }
      },
    }),
    nodes: chainObjects<Nodes<CNode>, Partial<Nodes<CNode>>>(scopedNodes, {
      getNode: (id: string) => {
        const node = scopedNodes.getNode(id);
        if (node) {
          return node;
        } else {
          return parent.nodes.getNode(id);
        }
      },
    }),
    links: scopedLinks,
  });

  return compositeInstance;
};
