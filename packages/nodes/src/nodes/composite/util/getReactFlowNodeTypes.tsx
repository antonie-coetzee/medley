import { memo, ReactNode, VFC } from "react";
import { BaseContext } from "@medley-js/core";
import {
  CNode,
  constants,
  Host,
  TNodeComponent,
  TNodeComponentProps,
} from "@medley-js/common";
import React from "react";
import { getNodes } from ".";

export async function getReactFlowNodeTypes(
  context: BaseContext<CNode>,
  host: Host
): Promise<{ [index: string]: ReactNode }> {
  const typeNames = [...new Set(getNodes(context).map((n) => n.type))];
  const nodeTypes = await Promise.all(
    typeNames.map(async (typeName) => {
      const nodeComponent = await context.medley.types.getExportFunction<
        TNodeComponent<CNode>
      >(typeName, constants.NodeComponent);
      return { typeName, nodeComponent };
    })
  );
  const mappedNodeTypes = nodeTypes.reduce((acc, crnt) => {
    if (crnt.nodeComponent) {
      acc[crnt.typeName] = wrapNodeComponent(context, host, crnt.nodeComponent);
    }
    return acc;
  }, {} as { [index: string]: ReactNode });
  return mappedNodeTypes;
}

function wrapNodeComponent(
  contex: BaseContext<CNode>,
  host: Host,
  NodeComponent: React.VFC<TNodeComponentProps>
) {
  const nodeWrapper: VFC<{
    id: string;
    data: any;
    selected: boolean;
    sourcePosition: string;
    targetPosition: string;
  }> = (props) => {
    const node = contex.medley.nodes.getNode(props.id);
    return node ? (
      <NodeComponent context={{ ...contex, node }} host={host} {...props} />
    ) : null;
  };
  return nodeWrapper;
}
