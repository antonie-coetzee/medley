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

function getHandles(medley: Medley<CNode>, node: CNode) {
  const compContext = Medley.getScopedInstance(medley, node.id);
  const inputHandles = compContext.nodes
    .getNodesByType(InputType.name)
    .map((n) => {
      return <Handle id={n.id} key={n.id} label={n.name} />;
    });
  const outputHandles = compContext.nodes
    .getNodesByType(OutputType.name)
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
