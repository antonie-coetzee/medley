import "@/lib/extensions";
import { css, Global } from "@emotion/react";
import { TEditNodeComponent } from "@medley-js/common";
import { PlayArrow } from "@mui/icons-material";
import { Box, ThemeProvider } from "@mui/material";
import { observer, Provider } from "mobx-react";
import React from "react";
import ReactFlow, {
  ControlButton,
  Controls,
  MiniMap,
  ReactFlowProvider,
} from "react-flow-renderer";
import { CompositeNode } from "../node";
import { getStores, useStores } from "../stores";
import { createTheme } from "../theme";
import { ContextMenu } from "./ContextMenu";
import { DialogManager } from "./DialogManager";

const theme = createTheme(); 

export const EditComponent: React.VFC = observer(() => {
  const { reactFlowStore: rFS, contextMenuStore: cMS, editStore } = useStores();
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ height: 850, backgroundColor:  (theme) => theme.composite.link.selectedStroke}}>
        {rFS.reactFlowProps !== null && (
          <ReactFlowProvider>
            <ReactFlow
              {...rFS.reactFlowProps}
              onPaneContextMenu={cMS.handleContextMenu}
              fitView
            >
              <MiniMap />
              <Controls>
                <ControlButton
                  title="run node"
                  onClick={() => editStore.runNode()}
                >
                  <PlayArrow />
                </ControlButton>
              </Controls>
            </ReactFlow>
          </ReactFlowProvider>
        )}
        <ContextMenu />
        <DialogManager />
      </Box>
    </ThemeProvider>
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
