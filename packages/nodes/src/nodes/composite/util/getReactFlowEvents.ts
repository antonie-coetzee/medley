import { NodeContext } from "@medley-js/core";
import {
  CLink,
  CNode,
  CType,
  NodeEditComponentProps,
} from "@medley-js/common";
import React from "react";
import { CompositeNode } from "../node";
import { Connection, Edge, Elements, Node as RFNode } from "react-flow-renderer";

export function getReactFlowEvents(
  context: NodeContext<CompositeNode, CNode, CType, CLink>,
  edit?: NodeEditComponentProps["edit"]
) {
  const onConnect = (edge: Connection | Edge) =>
    context.medley.links.addLink({
      source: edge.source || "",
      target: edge.target || "",
      port: edge.targetHandle || "",
      scope: context.node.id,
    });

  const onNodeDragStop: (
    event: React.MouseEvent<Element, MouseEvent>,
    node: RFNode<any>
  ) => void = (_, rfNode) => {
    const mNode = context.medley.nodes.getNode(rfNode.id);
    if (mNode) {
      mNode.position = rfNode.position;
    }
  };

  const onNodeDoubleClick: (event: React.MouseEvent<Element, MouseEvent>, node: RFNode<any>) => void = (_,node) => {
    if(node && edit?.openEditComponent){
        edit.openEditComponent(node.id);
    }
    console.log(`node double clicked: ${node.id}`);
  }

  const onElementsRemove : ((elements: Elements<any>) => void) = (elements) => {
    if(elements){
      elements.forEach(el=>{
        if((el as Edge).source){
        }else{
          context.medley.nodes.deleteNode(el.id);
        }
      })
    }
  }

  return { onConnect, onNodeDragStop, onNodeDoubleClick , onElementsRemove};
}
