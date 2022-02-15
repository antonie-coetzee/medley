import "@/lib/extensions";
import { TEditNodeComponent } from "@medley-js/common";
import { observer, Provider } from "mobx-react";
import React from "react";
import ReactFlow, {
  Controls,
  MiniMap,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from "react-flow-renderer";
import { CompositeNode } from "../node";
import { getStores, useStores } from "../stores";
import { ContextMenu } from "./ContextMenu";
import { DialogManager } from "./DialogManager";

export const EditComponent: React.VFC = observer(() => {
  const { reactFlowStore: rFS, contextMenuStore: cMS } = useStores();
  return (
    <div style={{ height: 850 }}>
      {rFS.reactFlowProps !== null && (
        <ReactFlowProvider>
          <ReactFlow
            {...rFS.reactFlowProps}
            onPaneContextMenu={cMS.handleContextMenu}
            fitView
          >
            <MiniMap />
            <Controls />
          </ReactFlow>
        </ReactFlowProvider>
      )}
      <ContextMenu />
      <DialogManager />
    </div>
  );
});

export const EditNodeComponent: TEditNodeComponent<CompositeNode> = (props) => {
  const stores = getStores(props.context, props.host);
  return (
    <Provider {...stores}>
      <EditComponent />
    </Provider>
  );
};
