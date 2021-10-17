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

export const getNodeComponent: GetNodeComponent = async () => {
  return ({ node, selected }) => {
    const [age, setAge] = React.useState('');
    const handleChange = (event: SelectChangeEvent) => {
      setAge(event.target.value as string);
    };
    return (
      <>
        <Handle
          type="target"
          position={Position.Left}
          style={{ background: "#555", top: "50%" }}
          onConnect={(params) => console.log("handle onConnect", params)}
          isConnectable={true}
          id="input"
        />
        <Card
          style={{ maxWidth: "200px" }}
          variant="outlined"
          sx={selected ? { boxShadow: 2 } : undefined}
        >
          <DragIndicatorIcon className="drag-handle" style={{position:"absolute", right:0}} />
          <CardHeader
            style={{ backgroundColor: "#b7dbff" }}
            title={"Identity"}
            subheader={node.name}
            avatar={<Info />}
          >        
          </CardHeader>
          <CardContent>
            <Typography color="textSecondary" gutterBottom variant="caption">
              Identity node that passes input unchanged to the output
            </Typography>
            <Slider
              size="small"
              defaultValue={70}
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
