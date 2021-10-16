import { memo, ReactNode, VFC } from 'react';
import { BaseContext } from "@medley-js/core";
import {
  CNode,
  constants, GetNodeComponent, NodeComponentProps
} from "@medley-js/common";
import React from 'react';

export async function getReactFlowNodeTypes(
  contex: BaseContext<CNode>): Promise<{ [index: string]: ReactNode; }> {
  const typeNames = contex.medley.nodes.getUsedTypes();
  const nodeTypes = await Promise.all(
    typeNames.map(async (typeName) => {
      const getNodeComponent: GetNodeComponent |
        undefined = await contex.medley.types.getExportFunction(
          typeName,
          constants.getNodeComponent
        );
      return { typeName, nodeComponent: await getNodeComponent?.(contex) };
    })
  );
  return nodeTypes.reduce((acc, crnt) => {
    if (crnt.nodeComponent) {
      acc[crnt.typeName] = wrapNodeComponent(
        contex,
        crnt.nodeComponent
      );
    }
    return acc;
  }, {} as { [index: string]: ReactNode; });
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
