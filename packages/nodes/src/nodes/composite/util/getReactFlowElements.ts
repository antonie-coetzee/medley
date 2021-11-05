import { BaseContext, NodeContext } from "@medley-js/core";
import {
  CLink,
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
  contex: NodeContext<CompositeNode, CNode, CType, CLink>
) {
  const reactFlowNodes = await getReactFlowNodes(contex);
  const reactFlowEdges = await getReactFlowEdges(contex);
  return [...reactFlowNodes, ...reactFlowEdges];
}

async function getReactFlowNodes(
  context: BaseContext<CNode, CType, CLink>
): Promise<RFNode[]> {
  const mNodes = getNodes(context);
  /* combine props with node type's props */
  return Promise.all(
    mNodes.map(async (node) => {
      const nodeProps = await context.medley.types.runExportFunction<
        DecorateNode<CNode>
      >(node.type, constants.decorateNode, {
        ...context,
        ...{ node },
      });
      const props = {
        selectable: true,
        draggable: true,
        connectable: true,
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        ...nodeProps,
      };
      return {
        data: { ...context, node },
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

async function getReactFlowEdges(context: BaseContext<CNode>): Promise<Edge[]> {
  const mLinks = context.medley.links.getLinks();
  const edges = await Promise.all(
    mLinks.map(async (mLink) => {
      const node = context.medley.nodes.getNode(mLink.source);
      if (node == null) {
        return;
      }
      const decorateLink = await context.medley.types.getExportFunction<DecorateLink>(
        node.type,
        constants.decorateLink
      );
      const linkComponent = await context.medley.types.getExportFunction<TLinkComponent>(
        node.type,
        constants.LinkComponent
      );
      const linkProps = await decorateLink?.({ ...context, node });
      return {
        data: { context, link:mLink },
        id: `${mLink.scope}${mLink.source}${mLink.target}${mLink.port}`,
        source: mLink.source,
        target: mLink.target,
        targetHandle: mLink.port,
        type: linkComponent && node.type,
        ...linkProps,
      };
    })
  );
  return edges.filter((n) => n !== undefined) as Edge[];
}
