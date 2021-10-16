import React from "react";
import ReactFlow, { Controls, MiniMap } from "react-flow-renderer";
import { EventType, NodeContext } from "@medley-js/core";
import { CLink, CNode, CType, GetNodeEditComponent } from "@medley-js/common";
import { CompositeNode } from "./node";
import { getReactFlowElements } from "./util/getReactFlowElements";
import { getReactFlowNodeTypes } from "./util/getReactFlowNodeTypes";
import { getReactFlowEvents } from "./util/getReactFlowEvents";
import { useCompositeNodeState } from "./hooks/useCompositeNodeState";
import useContextMenu from "./hooks/useContextMenu";
import { getContextMenu } from "./util/getContextMenu";

export const getNodeEditComponent: GetNodeEditComponent<CompositeNode> = async (
  context: NodeContext<CompositeNode, CNode, CType, CLink>
) => {
  const elements = await getReactFlowElements(context);
  const nodeTypes = await getReactFlowNodeTypes(context);

  return ({edit}) => {
    const events = getReactFlowEvents(context, edit);
    const rfState = useCompositeNodeState(context, { elements, nodeTypes });
    const {ContextMenu, handleContextMenu} = useContextMenu(getContextMenu(context));
    return (
      <div style={{ height: 600 }}>
        <ReactFlow {...rfState} {...events} onPaneContextMenu={handleContextMenu}
          elementsSelectable={true}>
          <MiniMap />
          <Controls />
        </ReactFlow>
        {ContextMenu}
      </div>
    );
  };
};
