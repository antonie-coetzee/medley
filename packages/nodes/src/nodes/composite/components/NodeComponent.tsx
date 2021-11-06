import React from "react";
import { Medley } from "@medley-js/core";
import { CNode, TNodeComponent } from "@medley-js/common";
import { Position } from "react-flow-renderer";
import { InputType } from "../scopedTypes/input";
import { OutputType } from "../scopedTypes/output";
import { styled } from "@mui/system";
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
import { Info, GroupWork, DragIndicator } from "@mui/icons-material";
import { Handle } from "../../../components";
import { InputNode } from "../scopedTypes/input/InputNode";
import { OutputNode } from "../scopedTypes/output/node";

function getHandles(medley: Medley<CNode>, node: CNode) {
  const compContext = Medley.getScopedInstance(medley, node.id);
  const inputHandles = compContext.nodes
    .getNodesByType<InputNode>(InputType.name)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((n) => {
      return <Handle id={n.id} key={n.id} label={n.name} color={n.value.color} />;
    });
  const outputHandles = compContext.nodes
    .getNodesByType<OutputNode>(OutputType.name)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((n) => {
      return <Handle output id={n.id} key={n.id} label={n.name} />;
    });
  return [...outputHandles, ...inputHandles];
}

export const NodeComponent: TNodeComponent = ({
  context: { medley, node },
  selected,
}) => {
  return (
    <>
      <Card
        style={{ maxWidth: "200px", overflow: "visible", boxSizing:"content-box" }}
        variant="outlined"
        sx={selected ? { boxShadow: 1, borderWidth: "2px" } : { borderWidth: "2px" }}
      >
        <DragIndicator className="drag-handle" style={{position:"absolute", right:0}} />
        <CardHeader
          style={{ backgroundColor: "#b7dbff", paddingRight:"40px", marginBottom:"3px"}}
          title={`${node.name}`}
          avatar={<GroupWork />}
        ></CardHeader>
        <CardContent style={{ padding: "0px" }}>
          <div>{getHandles(medley, node)}</div>
        </CardContent>
        <CardContent>
          <Typography color="textSecondary" gutterBottom variant="caption">
            Typography...
          </Typography>
          <Slider
            key={"slider-" + node.id}
            size="small"
            aria-label="Small"
            valueLabelDisplay="auto"
          />
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Test</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Test"
              defaultValue="10"
            >
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </FormControl>
        </CardContent>
      </Card>
    </>
  );
};
