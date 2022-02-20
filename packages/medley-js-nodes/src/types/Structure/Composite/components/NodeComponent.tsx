import { Handle } from "@/lib/components";
import { TNodeComponent } from "@medley-js/common";
import { Card, CardContent, CardHeader } from "@mui/material";
import { Box } from "@mui/system";
import { Observer } from "mobx-react";
import React, { useEffect } from "react";
import { useUpdateNodeInternals } from "react-flow-renderer";
import { CompositeNode } from "../node";
import { getStores, NodeStore } from "../stores";

function getHandles(nodeStore: NodeStore) {
  const inputHandles = nodeStore.inputNodes
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((n) => {
      return (
         <Handle portId={n.id} key={n.id} label={n.name} color={n.value.color} />
      );
    });
  let outputHandles: JSX.Element[] = [];
  const outputNode = nodeStore.outputNodes?.[0] || null;
  if (outputNode) {
    outputHandles = [
      <Handle
        output
        portId={outputNode.id}
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
      >
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
      </Card>
    </>
  );
};
