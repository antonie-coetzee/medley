import {
  chainObjects,
  CLink,
  CMedley,
  CMedleyTypes,
  CNode,
  CType,
} from "@medley-js/common";
import {
  AnyLink,
  Links,
  Medley,
  NodePart,
  Nodes,
  NonNullableType,
  PortLink,
  Types,
  Unwrap,
} from "@medley-js/core";
import { onLinksChange } from "../links";
import { onNodeInsert, onNodesChange } from "../nodes";

export function createCompositeScope(medley: CMedley, compositeNodeId: string) {
  const parent = medley;

  const scopedNodes = new Nodes<CNode>(compositeNodeId, parent.nodeRepository);
  const scopedTypes = new Types<CType>(compositeNodeId, parent.typeRepository);
  const scopedLinks = new Links<CLink>(compositeNodeId, parent.linkRepository);

  const compositeScope = new Medley<CMedleyTypes>({
    scope: compositeNodeId,
    nodeRepository: parent.nodeRepository,
    typeRepository: parent.typeRepository,
    linkRepository: parent.linkRepository,
    loader: parent.loader,
    composer: chainObjects(parent.composer, {
      runLink: async (link, ...args): Promise<any> => {
        return parent.composer.runLink(link, args);
      },
    }),
    types: chainObjects(scopedTypes, {
      getType: (typeName) => {
        const type = scopedTypes.getType(typeName);
        if (type) {
          return type;
        } else {
          return parent.types.getType(typeName);
        }
      },
      getExport: async (typeName, exportName) => {
        const exportValue = await scopedTypes.getExport(typeName, exportName);
        if (exportValue) {
          return exportValue;
        } else {
          return parent.types.getExport(typeName, exportName);
        }
      },
    }),
    nodes: chainObjects<Nodes<CNode>>(scopedNodes, {
      insertNodePart: function <TNode extends CNode>(
        this: Nodes<CNode>,
        nodePart: NodePart<TNode>
      ) {
        let newNode: TNode;
        if (this[onNodeInsert]) {
          newNode = scopedNodes.insertNodePart(this[onNodeInsert]!(nodePart));
        } else {
          newNode = scopedNodes.insertNodePart(nodePart);
        }
        this[onNodesChange]?.call(scopedNodes);
        return newNode;
      },
      deleteNode: function (this: Nodes<CNode>, nodeId) {
        this[onNodesChange]?.call(scopedNodes);
        return scopedNodes.deleteNode(nodeId);
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
      upsertLink: function (this: Links<CLink>, newLink: AnyLink<CLink>) {
        this[onLinksChange]?.call(scopedLinks);
        return scopedLinks.upsertLink(newLink);
      },
      deleteLink: function (this: Links<CLink>, link: CLink) {
        this[onLinksChange]?.call(scopedLinks);
        return scopedLinks.deleteLink(link);
      },
    }),
  });
  return compositeScope;
}
