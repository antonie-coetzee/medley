import { TEditNodeComponent } from "@medley-js/common";
import { observer, Provider } from "mobx-react";
import React from "react";
import ReactFlow, {
  Controls,
  MiniMap,
  ReactFlowProvider
} from "react-flow-renderer";
import { CompositeNode } from "../CompositeNode";
import { Stores, useStores } from "../stores";
import { ContextMenu } from "./ContextMenu";
import { DialogManager } from "./DialogManager";

export const EditComponent: React.VFC = observer(() => {
  const { reactFlowStore: rFS, contextMenuStore: cMS } = useStores();
  return (
    <div style={{ height: 800 }}>
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
  const stores = new Stores(props);
  return (
    <Provider {...stores}>
      <EditComponent />
    </Provider>
  );
};
