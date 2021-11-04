import React from "react";
import { Medley } from "@medley-js/core";
import { CNode, TNodeComponent } from "@medley-js/common";
import { Handle, Position } from "react-flow-renderer";
import { InputType } from "../scopedTypes/input";
import { OutputType } from "../scopedTypes/output";
import { styled } from "@mui/system";
import { Badge, BadgeProps, Card, CardContent, CardHeader, Tooltip, Typography } from "@mui/material";
import { Info } from "@mui/icons-material";
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';

const StyledDiv = styled("div")(({ theme }) => ({
  height:"20px",
  lineHeight:"20px",
  fontSize:"14px",
  cursor: "default",
  //backgroundColor:"#0288d1",
  //color:"white",
  paddingLeft:"4px",
  paddingRight:"4px",
  flex:1,
  //translate: "-20px",
  width:""
}));

function getHandles(medley: Medley<CNode>, node: CNode) {
  const compContext = Medley.getChildInstance(medley, node.id);
  const inputHandles = compContext.nodes
    .getNodesByType(InputType.name)
    .map((n) => {
      return (<div style={{display: "flex", flexWrap: "wrap", flexDirection: "row", alignItems:"center", paddingLeft:"3px"}}>
        <Handle
          key={n.id}
          type="target"
          position={Position.Left}
          style={{
            borderTopLeftRadius: "5px",
            borderBottomLeftRadius: "5px",
            borderBottomRightRadius: "5px",
            borderTopRightRadius: "5px",
            border: "none",
            height: "10px",
            width: "10px",
            backgroundColor: "#0288d1",
            position:"unset",
            //marginBottom:"5px",
            transform: "none",
          }}
          isConnectable={true}
          id={n.id}
        >       
        </Handle>
        <StyledDiv>{n.name}</StyledDiv>
        </div>
      );
    });
  const outputHandles = compContext.nodes
    .getNodesByType(OutputType.name)
    .map((n) => {
      return (
        <Handle
          key={n.id}
          type="source"
          position={Position.Right}
          id={n.id}
          style={{ top: 10, background: "#555" }}
          isConnectable={true}
        />
      );
    });
  return [...inputHandles, ...outputHandles];
}

export const NodeComponent: TNodeComponent = ({
  context: { medley, node }, selected
}) => {
  return (
    <>    
      <Card
          style={{ maxWidth: "200px", overflow:"visible" }}
          variant="outlined"
          sx={selected ? { boxShadow: 2 } : undefined}
        >
          <CardHeader
            style={{ backgroundColor: "#b7dbff" }}
            title={"Test"}
            subheader={`Name: ${node.name}`}
            avatar={<Info />}
          >        
          </CardHeader>
          <CardContent style={{padding:"0px"}}>
            <div style={{translate:"0px", width:"calc(100% + 0px)"}}>
              {getHandles(medley, node)}
            </div>
          
          </CardContent>
        </Card>
    </>
  );
};
