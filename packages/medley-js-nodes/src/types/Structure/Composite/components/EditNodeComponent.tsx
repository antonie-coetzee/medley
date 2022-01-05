import { TEditNodeComponent } from "@medley-js/common";
import { observer, Provider } from "mobx-react";
import React from "react";
import ReactFlow, {
  Controls,
  MiniMap,
  ReactFlowProvider
} from "react-flow-renderer";
import { CompositeNode } from "../node";
import { getStores, Stores, useStores } from "../stores";
import { ContextMenu } from "./ContextMenu";
import { DialogManager } from "./DialogManager";
import "@/lib/extensions";

export const EditComponent: React.VFC = observer(() => {
  const { reactFlowStore: rFS, contextMenuStore: cMS } = useStores();
  return (
    <div style={{ height: 850 }}>
      {rFS.reactFlowProps !== null && (
        <ReactFlowProvider>
          <ReactFlow
            {...rFS.reactFlowProps}
            onPaneContextMenu={cMS.handleContextMenu}
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
