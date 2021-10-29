import { observer } from "mobx-react";
import React from "react";
import ReactFlow, {
  Controls,
  MiniMap,
  ReactFlowProvider,
} from "react-flow-renderer";
import { useStores } from "../stores";
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
