import { NodeContext } from "@medley-js/core";
import { CLink, CNode, CType, NodeEditComponentProps } from "@medley-js/common";
import React from "react";
import { CompositeNode } from "../node";
import { Connection, Edge, Node as RFNode } from "react-flow-renderer";
import { MenuItem } from "@mui/material";
import { InputType } from "../terminals/input/type";

function getAddInputNode(
  context: NodeContext<CompositeNode, CNode, CType, CLink>
): React.VFC<{ close: () => void, mouseX?:number, mouseY?:number }> {


  return ({close, mouseX, mouseY}) => {
    const addInput = ()=>{
        const node = context.medley.nodes.upsertNode({name:"INPUT", type: InputType.name} );
        if(mouseX && mouseY){
          node.position = {x: mouseX - 50, y:mouseY - 50};
        }
        
        close();
    }  
    return <MenuItem onClick={addInput}>Add Input</MenuItem>;
  };
}

export function getContextMenu(
  context: NodeContext<CompositeNode, CNode, CType, CLink>
) {
  return [getAddInputNode(context)];
}
