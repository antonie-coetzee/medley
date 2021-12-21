import { BaseContext, isPortLink, NodeContext, PortLink } from "@medley-js/core";
import {
  CLink,
  CMedleyTypes,
  CNode,
  constants,
  CType,
  DecorateLink,
  DecorateNode,
  TLinkComponent,
} from "@medley-js/common";
import { CompositeNode } from "../CompositeNode";
import { Edge, Node as RFNode, Position } from "react-flow-renderer";
import { getNodes } from "./getNodes";

export async function getReactFlowElements(
  contex: NodeContext<CompositeNode, CMedleyTypes>
) {
  const reactFlowNodes = await getReactFlowNodes(contex);
  const reactFlowEdges = await getReactFlowEdges(contex);
  return [...reactFlowNodes, ...reactFlowEdges];
}

async function getReactFlowNodes(
  context: NodeContext<CompositeNode, CMedleyTypes>
): Promise<RFNode[]> {
  const mNodes = getNodes(context);
  /* combine props with node type's props */
  return Promise.all(
    mNodes.map(async (node) => {
      const nodeContext = new NodeContext(context.medley, node)
      const nodeProps = await context.medley.types.runExportFunction<
        DecorateNode<CNode>
      >(node.type, constants.decorateNode, nodeContext);
      const props = {
        selectable: true,
        draggable: true,
        connectable: true,
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        ...nodeProps,
      };
      return {
        data: nodeContext,
        id: node.id,
        position: { x: node.position?.[0] || 0, y: node.position?.[1] || 0 },
        type: node.type,
        selectable: props.selectable,
        draggable: props.draggable,
        connectable: props.connectable,
        sourcePosition: props.sourcePosition as Position,
        targetPosition: props.targetPosition as Position,
        dragHandle: props.dragHandle,
      };
    })
  );
}

async function getReactFlowEdges(context: NodeContext<CompositeNode, CMedleyTypes>): Promise<Edge[]> {
  const mLinks = context.medley.links.getLinks();
  const edges = await Promise.all(
    mLinks.filter(l=>isPortLink(l)).map(async (l) => {
      const pLink = l as PortLink;
      const node = context.medley.nodes.getNode(pLink.source);
      if (node == null) {
        return;
      }
      const decorateLink = await context.medley.types.getExport<DecorateLink>(
        node.type,
        constants.decorateLink
      );
      const linkComponent = await context.medley.types.getExport<TLinkComponent>(
        node.type,
        constants.LinkComponent
      );
      const linkProps = await decorateLink?.({ ...context, node });
      return {
        data: { context:{...context, node}, link:pLink },
        id: `${pLink.scope}${pLink.source}${pLink.target}${pLink.port}`,
        source: pLink.source,
        target: pLink.target,
        targetHandle: pLink.port,
        type: linkComponent && node.type,
        ...linkProps,
      };
    })
  );
  return edges.filter((n) => n !== undefined) as Edge[];
}
