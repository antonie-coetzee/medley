import React, { memo } from "react";
import { Handle, Position } from "react-flow-renderer";
import { GetNodeComponent } from "@medley-js/common";
import { IdentityNode } from "./node";
import { Info } from '@material-ui/icons';
import { Avatar, Card, CardContent, CardHeader, Typography } from "@material-ui/core";

export const getNodeComponent: GetNodeComponent = async () => {
  return ({ node }) => {
    return (
      <>
        <Handle
          type="target"
          position={Position.Left}
          style={{ background: "#555" }}
          onConnect={(params) => console.log("handle onConnect", params)}
          isConnectable={true}
        />
        <Card style={{ maxWidth: "200px" }}>
          <CardHeader style={{ backgroundColor: "#b7dbff" }} title={"Identity"} subheader={node.name} avatar={
            <Info />
          }>
          </CardHeader>
          <CardContent>
            <Typography color="textSecondary" gutterBottom variant="caption">
              Identity node that passes input unchanged to the output
            </Typography>
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
