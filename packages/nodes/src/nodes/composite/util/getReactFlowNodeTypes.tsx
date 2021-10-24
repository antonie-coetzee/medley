import { memo, ReactNode, VFC } from "react";
import { BaseContext } from "@medley-js/core";
import {
  CNode,
  constants,
  GetNodeComponent,
  NodeComponentProps,
} from "@medley-js/common";
import React from "react";
import { getNodes } from ".";

export async function getReactFlowNodeTypes(
  context: BaseContext<CNode>
): Promise<{ [index: string]: ReactNode }> {
  const typeNames = [...new Set(getNodes(context).map((n) => n.type))];
  const nodeTypes = await Promise.all(
    typeNames.map(async (typeName) => {
      const nodeComponent = await context.medley.types.runExportFunction<
        GetNodeComponent<CNode>
      >(typeName, constants.getNodeComponent, context);
      return { typeName, nodeComponent };
    })
  );
  return nodeTypes.reduce((acc, crnt) => {
    if (crnt.nodeComponent) {
      acc[crnt.typeName] = wrapNodeComponent(context, crnt.nodeComponent);
    }
    return acc;
  }, {} as { [index: string]: ReactNode });
}

export function wrapNodeComponent(
  contex: BaseContext,
  NodeComponent: React.VFC<NodeComponentProps>
) {
  const nodeWrapper: VFC<{
    id: string;
    data: any;
    selected: boolean;
    sourcePosition: string;
    targetPosition: string;
  }> = memo((props) => {
    const node = contex.medley.nodes.getNode(props.id);
    return node ? (
      <NodeComponent
        logger={contex.logger}
        medley={contex.medley}
        node={node}
        {...props}
      />
    ) : null;
  });
  return nodeWrapper;
}
