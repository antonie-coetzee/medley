import {
  CMedley,
  CNode,
  CNodeContext,
  Host,
  TNodeComponent,
  constants,
} from "@medley-js/common";
import { Box, Button, ButtonGroup, Fab, Popover, styled } from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  Add,
  Close,
  DragIndicator,
  Edit,
  HelpOutline,
} from "@mui/icons-material";
import { useStores } from "../stores";

export type NodeContainerProps = {
  host: Host;
  NodeComponent: TNodeComponent;
  context: CNodeContext;
  selected: boolean;
};

export const NodeContainer: React.FC<NodeContainerProps> = (props) => {
  const { editStore, nodeStore } = useStores();
  const [supportedActions, setSupportedActions] = useState({
    canEdit: false,
    canHelp: false,
  });

  const [popover, setPopover] = useState<React.VFC | null>(null);
  const [popoverAnchorEl, setPopoverAnchorEl] = useState<HTMLButtonElement | null>(null);
  const dragButtonRef = React.createRef<HTMLButtonElement>();
  const compositeScope = nodeStore.compositeScope;
  const NodeComponent = props.NodeComponent;
  const node = props.context.node;

  useEffect(() => {
    let isMounted = true; 
    (async () => { 
      const editNodeFunc = await compositeScope.types.getExport(
        node.type,
        constants.editNode
      );
      const helpFunc = await compositeScope.types.getExport(
        node.type,
        constants.HelpNodeComponent
      );
      if(isMounted){
        setSupportedActions({
          canEdit: editNodeFunc != null,
          canHelp: helpFunc != null,
        });
      }
    })()
    return () => { isMounted = false };
  }, []);

  return (
    <Box
      sx={{
        ":hover .node-header-menu": { opacity: 1 },
      }}
    >
      <HeaderMenu {...props} className="node-header-menu">
        {/* <Fab size="small" color="secondary" aria-label="add">
          
        </Fab> */}
        <ButtonGroup variant="contained">
          <Button
            className="drag-handle"
            size="small"
            style={{ cursor: "grab" }}
            ref={(element)=>{setPopoverAnchorEl(element)}}
          >
            <DragIndicator />
          </Button>
          {supportedActions.canEdit && (
            <Button
              size="small"
              onClick={(e) => {
                editStore.editNode(node, (cmpt)=>setPopover(cmpt));
              }}
            >
              <Edit />
            </Button>
          )}
          {supportedActions.canHelp && (
            <Button size="small">
              <HelpOutline />
            </Button>
          )}
          <Button
            size="small"
            onClick={() => {
              editStore.removeNode(node);
            }}
          >
            <Close />
          </Button>
        </ButtonGroup>
        <Popover
          open={popover != null && popoverAnchorEl != null}
          onClose={() => setPopover(null)}
          anchorReference={"anchorEl"}
          anchorEl={popoverAnchorEl}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          {popover}
        </Popover>
      </HeaderMenu>
      <Box className="node-container" style={{ cursor: "default" }}>
        <NodeComponent {...props} />
      </Box>
    </Box>
  );
};

const HeaderMenu = styled(Box)<NodeContainerProps>(({ theme }) => ({
  opacity: 0,
  transition: "opacity 0.1s linear",
  position: "absolute",
  transform: "translateY(-100%)",
  paddingBottom: "5px",
}));

async function getSupportedActions(medley: CMedley, node: CNode) {
  const editNodeFunc = await medley.types.getExport(
    node.type,
    constants.EditNodeComponent
  );
  const helpFunc = await medley.types.getExport(
    node.type,
    constants.HelpNodeComponent
  );
  return {
    hasEdit: editNodeFunc != null,
    hasHelp: helpFunc != null,
  };
}
