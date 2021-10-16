import { BaseContext, NodeContext } from "@medley-js/core";
import {
  CLink,
  CNode,
  constants,
  CType,
  GetLinkComponentProps,
  GetNodeComponentProps,
} from "@medley-js/common";
import { CompositeNode } from "../node";
import { Edge, Node as RFNode, Position } from "react-flow-renderer";

export async function getReactFlowElements(
  contex: NodeContext<CompositeNode, CNode, CType, CLink>
) {
  const reactFlowNodes = await getReactFlowNodes(contex);
  const reactFlowEdges = await getReactFlowEdges(contex);
  return [...reactFlowNodes, ...reactFlowEdges];
}

async function getReactFlowNodes(
  context: BaseContext<CNode>
): Promise<RFNode[]> {
  const mNodes = context.medley.nodes.getNodes();
  return Promise.all(
    mNodes.map(async (node) => {
      const getNodeProps = await context.medley.types.getExportFunction<GetNodeComponentProps>(
        node.type,
        constants.getNodeComponentProps
      );
      const nodeProps = await getNodeProps?.({ ...context, ...{ node } });
      const props = {
        selectable: true,
        draggable: true,
        connectable: true,
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        ...nodeProps,
      };
      return {
        id: node.id,
        position: { x: node.position?.x || 0, y: node.position?.y || 0 },
        type: node.type,
        selectable: props.selectable,
        draggable: props.draggable,
        connectable: props.connectable,
        sourcePosition: props.sourcePosition as Position,
        targetPosition: props.targetPosition as Position,
      };
    })
  );
}

async function getReactFlowEdges(context: BaseContext<CNode>): Promise<Edge[]> {
  const mLinks = context.medley.links.getLinks();
  return Promise.all(
    mLinks.map(async (mLink) => {
      const node = context.medley.nodes.getNode(mLink.source);
      let getLinkProps: GetLinkComponentProps | undefined;
      if (node) {
        getLinkProps = await context.medley.types.getExportFunction<GetLinkComponentProps>(
          node.type,
          constants.getLinkComponentProps
        );
      }
      const linkProps = await getLinkProps?.({ ...context, ...{ node } });
      return {
        id: `${mLink.scope}${mLink.source}${mLink.target}${mLink.port}`,
        source: mLink.source,
        target: mLink.target,
        targetHandle: mLink.port,
        ...linkProps,
      };
    })
  );
}
