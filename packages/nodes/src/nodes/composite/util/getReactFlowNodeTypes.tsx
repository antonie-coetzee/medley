import { memo, ReactNode, VFC } from "react";
import { BaseContext, NodeContext } from "@medley-js/core";
import {
  CLink,
  CNode,
  constants,
  CType,
  Host,
  TNodeComponent,
  TNodeComponentProps,
} from "@medley-js/common";
import React from "react";
import { getNodes } from ".";
import { observable } from "mobx";
import { observer } from "mobx-react";

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
      acc[crnt.typeName] = wrapNodeComponent(host, memo(observer(crnt.nodeComponent)));
    }
    return acc;
  }, {} as { [index: string]: ReactNode });
  return mappedNodeTypes;
}

function wrapNodeComponent(
  host: Host,
  NodeComponent: React.VFC<TNodeComponentProps>
) {
  const nodeWrapper: VFC<{
    id: string;
    data: NodeContext<CNode, CNode, CType, CLink>;
    selected: boolean;
    sourcePosition: string;
    targetPosition: string;
  }> = (props) => {
    const nodeContext = props.data;
    if(nodeContext){
      return <NodeComponent context={nodeContext} host={host} selected={props.selected} />
    }else{
      return null
    }
  };
  return nodeWrapper;
}
