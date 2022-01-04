import React from "react";
import { Handle, Position } from "react-flow-renderer";
import { TNodeComponent } from "@medley-js/common";
import { DragIndicator } from '@mui/icons-material';

import Info from "@mui/icons-material/Info";
import {
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

export const NodeComponent: TNodeComponent<IdentityNode> = ({ context:{node}, selected }) => {
    const [age, setAge] = React.useState('');
    const [slider, setSlider] = React.useState(node.value?.slider || 0);
    const handleChange = (event: SelectChangeEvent) => {
      const newAge = event.target.value as string;
      setAge(newAge);
      node.value = {...node.value, age:newAge}
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
          <DragIndicator className="drag-handle" style={{position:"absolute", right:0}} />
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
              value={slider}
              onChange={(_,v)=>{
                const n = v as number;
                setSlider(n) ;
                node.value = {...node.value, slider:n}
              }}
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
