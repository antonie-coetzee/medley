import {
  AnyLink,
  Links,
  Medley,
  NodePart,
  Nodes,
  Types,
} from "@medley-js/core";
import { CLink, CNode, CType, chainObjects } from "@medley-js/common";

import { onNodeInsert, onNodesChange } from "./nodes";
import { onLinksChange } from "./links";

export const newCompositeScope = Symbol("newCompositeScope");

declare module "@medley-js/core" {
  interface Medley {
    [newCompositeScope]: (compositeNodeId: string) => Medley<CNode, CType, CLink>;
  }
}

Medley.prototype[newCompositeScope] = function (
  this: Medley<CNode, CType, CLink>,
  compositeNodeId: string
) {
  const parent = this;

  const scopedNodes = new Nodes<CNode>(compositeNodeId, parent.nodeRepository);
  const scopedTypes = new Types<CType>(compositeNodeId, parent.typeRepository);
  const scopedLinks = new Links<CLink>(compositeNodeId, parent.linkRepository);

  const compositeScope = new Medley<CNode, CType, CLink>({
    scopeId: compositeNodeId,
    nodeRepository: parent.nodeRepository,
    typeRepository: parent.typeRepository,
    linkRepository: parent.linkRepository,
    loader: parent.loader,
    cache: parent.cache,
    types: chainObjects(scopedTypes, {
      getType: (typeName) => {
        const type = scopedTypes.getType(typeName);
        if (type) {
          return type;
        } else {
          return parent.types.getType(typeName);
        }
      },
    }),
    nodes: chainObjects<Nodes<CNode>>(scopedNodes, {
      insertNode: <TNode extends CNode>(nodePart: NodePart<TNode>) => { 
        let newNode: TNode;    
        if(scopedNodes[onNodeInsert]){
          newNode = scopedNodes.insertNode(scopedNodes[onNodeInsert]!(nodePart))
        }else{
          newNode = scopedNodes.insertNode(nodePart);      
        }
        scopedNodes[onNodesChange]?.call(scopedNodes);
        return newNode;
      },
      deleteNode: (node) => {
        scopedNodes[onNodesChange]?.call(scopedNodes);
        return scopedNodes.deleteNode(node);
      },
      getNode: (id: string) => {
        const node = scopedNodes.getNode(id);
        if (node) {
          return node;
        } else {
          return parent.nodes.getNode(id);
        }
      },
    }),
    links: chainObjects<Links<CLink>>(scopedLinks, {
      addLink: (newLink: AnyLink<CLink>) => {
        scopedLinks[onLinksChange]?.call(scopedLinks);
        return scopedLinks.addLink(newLink);
      },
      deleteLink: (link: CLink) => {
        scopedLinks[onLinksChange]?.call(scopedLinks);
        return scopedLinks.deleteLink(link);
      },
    }),
  });

  return compositeScope;
};
