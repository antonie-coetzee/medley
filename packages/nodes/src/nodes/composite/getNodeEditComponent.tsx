import React from "react";
import ReactFlow, {
  Controls,
  EdgeProps,
  getBezierPath,
  getMarkerEnd,
  MiniMap,
  ReactFlowProvider,
} from "react-flow-renderer";
import { NodeContext } from "@medley-js/core";
import { CLink, CNode, CType, GetNodeEditComponent } from "@medley-js/common";
import { CompositeNode } from "./node";
import { getReactFlowElements } from "./util/getReactFlowElements";
import { getReactFlowNodeTypes } from "./util/getReactFlowNodeTypes";
import { getReactFlowEvents } from "./util/getReactFlowEvents";
import { useCompositeNodeState } from "./hooks/useCompositeNodeState";
import useContextMenu from "./hooks/useContextMenu";
import { getContextMenu } from "./util/getContextMenu";
import useDialog from "./hooks/useDialog";
import { Provider } from "mobx-react";
import { Stores } from "./stores";
import { DialogManager } from "./component/DialogManager";

export const getNodeEditComponent: GetNodeEditComponent<CompositeNode> = async (
  context: NodeContext<CompositeNode, CNode, CType, CLink>
) => {
  const elements = await getReactFlowElements(context);
  const nodeTypes = await getReactFlowNodeTypes(context);
  const stores = new Stores();
  return ({ edit }) => {
    const events = getReactFlowEvents(context, edit);
    const rfState = useCompositeNodeState(context, { elements, nodeTypes });
    const { ContextMenu, handleContextMenu } = useContextMenu(
      getContextMenu(context)
    );
    const {Dialog, } = useDialog();
    return (
      <div style={{ height: 800 }}>
        <Provider {...stores}>
          <ReactFlowProvider>
            <ReactFlow
              {...rfState}
              {...events}
              onPaneContextMenu={handleContextMenu}
              elementsSelectable={true}
            >
              <MiniMap />
              <Controls />
            </ReactFlow>
          </ReactFlowProvider>
          {ContextMenu}
          <DialogManager/>
        </Provider>
      </div>
    );
  };
};
