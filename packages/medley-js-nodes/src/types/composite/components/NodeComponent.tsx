import React, { useEffect } from "react";
import { NodeContext } from "@medley-js/core";
import { CMedleyTypes, CNode, TNodeComponent } from "@medley-js/common";
import { useUpdateNodeInternals } from "react-flow-renderer";
import { Box } from "@mui/system";
import { Card, CardContent, CardHeader } from "@mui/material";
import {
  DragIndicator,
  Close,
  HelpOutline,
  Refresh,
} from "@mui/icons-material";
import { Handle } from "@/lib/components";
import { CompositeNode } from "../CompositeNode";
import { getStores, NodeStore } from "../stores";

function getHandles(nodeStore: NodeStore) {
  const inputHandles = nodeStore.inputNodes
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((n) => {
      return (
        <Handle id={n.id} key={n.id} label={n.name} color={n.value.color} />
      );
    });
  let outputHandles: JSX.Element[] = [];
  const outputNode = nodeStore.outputNodes?.[0] || null;
  if (outputNode) {
    outputHandles = [
      <Handle
        output
        id={outputNode.id}
        key={outputNode.id}
        label={outputNode.name}
      />,
    ];
  }
  return [...outputHandles, ...inputHandles];
}

export const NodeComponent: TNodeComponent<CompositeNode> = ({
  context,
  selected,
  host,
}) => {
  const { nodeStore } = getStores(context, host);
  const node = context.observableNode;
  const updateNodeInternals = useUpdateNodeInternals();
  useEffect(() => {
    updateNodeInternals(context.node.id);
  });

  return (
    <>
      <Card
        style={{
          maxWidth: "200px",
          overflow: "visible",
          boxSizing: "content-box",
          borderColor: "#e9e9e9",
          paddingBottom: "0px",
        }}
        variant="outlined"
        sx={
          selected
            ? { boxShadow: 2, borderWidth: "2px" }
            : { borderWidth: "2px" }
        }
      >
        <Box
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#b7dbff",
            borderBottom: "1px solid #e9e9e9",
          }}
        >
          <DragIndicator className="drag-handle" />
          {/* <Public />  */}
          {/* <div/> */}
          {<Refresh />}
          {/* <AutoAwesomeMotion/> */}
          <HelpOutline />
          <Close />
        </Box>
        <CardHeader
          sx={{
            backgroundColor: "#b7dbff",
            marginBottom: "3px",
            borderBottom: "2px solid #e9e9e9",
            padding: "2px",
            height: "42px",
            paddingLeft: "8px",
            paddingRight: "8px",
            "& .MuiCardHeader-subheader": {},
          }}
          subheader={`${node.name}`}
        ></CardHeader>
        <CardContent style={{ padding: "0px" }}>
          <Box
            sx={{
              "& .handle:not(:last-child)": {
                borderBottom: "1px solid #e9e9e9",
              },
            }}
          >
            {getHandles(nodeStore)}
          </Box>
        </CardContent>
        {/* <CardContent>
        </CardContent> */}
      </Card>
    </>
  );
};
