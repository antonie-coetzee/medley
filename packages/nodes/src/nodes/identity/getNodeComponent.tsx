import React from "react";
import { Handle, Position } from "react-flow-renderer";
import { GetNodeComponent } from "@medley-js/common";
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

import Info from "@mui/icons-material/Info";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Slider,
  Typography,
} from "@mui/material";
import { IdentityNode } from "./node";

const labelStyle = {
  display: 'flex',
  alignItems: 'center',
};

const dragHandleStyle = {
  display: 'inline-block',
  width: 25,
  height: 25,
  backgroundColor: 'teal',
  marginLeft: 5,
  borderRadius: '50%',
};

export const getNodeComponent: GetNodeComponent<IdentityNode> = async () => {
  return ({ node, selected }) => {
    const [age, setAge] = React.useState('');
    const handleChange = (event: SelectChangeEvent) => {
      const newAge = event.target.value as string;
      setAge(newAge);
      node.value = {age:newAge}
    };
    return (
      <>
        <Handle
          type="target"
          position={Position.Left}
          style={{ background: "#555", top: "50%" }}
          isConnectable={true}
          id="input1"
        />
        <Handle
          type="target"
          position={Position.Left}
          style={{ background: "#555", top: "75%" }}
          isConnectable={true}
          id="input2"
        />
        <Card
          style={{ maxWidth: "200px" }}
          variant="outlined"
          sx={selected ? { boxShadow: 2 } : undefined}
        >
          <DragIndicatorIcon className="drag-handle" style={{position:"absolute", right:0}} />
          <CardHeader
            style={{ backgroundColor: "#b7dbff" }}
            title={"Test"}
            subheader={`Name: ${node.name}`}
            avatar={<Info />}
          >        
          </CardHeader>
          <CardContent>
            <Typography color="textSecondary" gutterBottom variant="caption">
              Test component
            </Typography>
            <Slider
              key={"slider-" + node.id}
              size="small"
              aria-label="Small"
              valueLabelDisplay="auto"
            />
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Age</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={age}
                label="Age"
                onChange={handleChange}
              >
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>
          </CardContent>
        </Card>
        <Handle
          type="source"
          position={Position.Right}
          style={{ background: "#555" }}
          isConnectable={true}
        />
      </>
    );
  };
};
