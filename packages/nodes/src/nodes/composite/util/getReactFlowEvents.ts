import { NodeContext } from "@medley-js/core";
import {
  CLink,
  CNode,
  constants,
  CPort,
  CType,
  GetPorts,
  NodeEditComponentProps,
} from "@medley-js/common";
import React from "react";
import { CompositeNode } from "../node";
import { Connection, Edge, Elements, Node as RFNode } from "react-flow-renderer";

export function getReactFlowEvents(
  context: NodeContext<CompositeNode, CNode, CType, CLink>,
  edit?: NodeEditComponentProps["edit"]
) {
  const onConnect = (edge: Connection | Edge) => {
    context.medley.links.addLink({
      source: edge.source || "",
      target: edge.target || "",
      port: edge.targetHandle || "",
      scope: context.node.id,
    });
  }

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
    console.log(JSON.stringify(context.medley.graph.getGraph(),null, 2));
  }

  const onElementsRemove : ((elements: Elements<any>) => void) = (elements) => {
    if(elements){
      elements.forEach(async el=>{
        if((el as Edge).source){
        }else{
          const node = context.medley.nodes.getNode(el.id);
          if(node == null){
            return;
          }
          const links  = context.medley.links.getLinks()
          for (const l of links) {
            if(l.source === node.id || l.target === node.id){
              context.medley.links.deleteLink(l);
            }
          }
          context.medley.nodes.deleteNode(el.id);
        }
      })
    }
  }

  return { onConnect, onNodeDragStop, onNodeDoubleClick , onElementsRemove};
}
