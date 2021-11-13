import React, { useEffect } from "react";
import { Medley, NodeContext } from "@medley-js/core";
import { CNode, TNodeComponent } from "@medley-js/common";
import { Position, useUpdateNodeInternals } from "react-flow-renderer";
import { InputType } from "../scopedTypes/input";
import { OutputType } from "../scopedTypes/output";
import { Box, styled } from "@mui/system";
import {
  Badge,
  BadgeProps,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Tooltip,
  Typography,
} from "@mui/material";
import { Info, GroupWork, DragIndicator, Close, Public, Sync, AutoAwesome, AutoAwesomeMotion, HelpOutline, AccountTree, AccountTreeOutlined, Refresh } from "@mui/icons-material";
import { Handle } from "../../../components";
import { InputNode } from "../scopedTypes/input/InputNode";
import { OutputNode } from "../scopedTypes/output/node";
import { CompositeNode } from "../CompositeNode";
import { NodeStore } from "../stores/NodeStore";

function getHandles(context:NodeContext<CNode>) {
  const nodeStore = NodeStore.get(context);
  const inputHandles = nodeStore.inputNodes.slice().
    sort((a, b) => a.name.localeCompare(b.name))
    .map((n) => {
      return (
        <Handle id={n.id} key={n.id} label={n.name} color={n.value.color} />
      );
    });
  let outputHandles:JSX.Element[] = [];
  const outputNode = nodeStore.outputNode;
  if(outputNode){
    outputHandles = [<Handle output id={outputNode.id} key={outputNode.id} label={outputNode.name} />]
  }
  return [...outputHandles, ...inputHandles];
}

export const NodeComponent: TNodeComponent<CompositeNode> = ({
  context,
  selected,
}) => { 
  const updateNodeInternals = useUpdateNodeInternals();
  useEffect(()=>{
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
          paddingBottom: "0px"
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
            borderBottom: "1px solid #e9e9e9"
          }}
        >
          <DragIndicator className="drag-handle" />
           {/* <Public />  */}
           {/* <div/> */}
          { <Refresh /> }
          {/* <AutoAwesomeMotion/> */}
          <HelpOutline/>
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
            "& .MuiCardHeader-subheader": {}
          }}
          subheader={`${context.node.name}`}
        ></CardHeader>
        <CardContent style={{ padding: "0px" }}>
          <Box sx={{
            '& .handle:not(:last-child)' : {
              borderBottom: "1px solid #e9e9e9"
            }
          }}>
            {getHandles(context)}
          </Box>
        </CardContent>
        {/* <CardContent>
        </CardContent> */}
      </Card>
      
    </>
  );
};
