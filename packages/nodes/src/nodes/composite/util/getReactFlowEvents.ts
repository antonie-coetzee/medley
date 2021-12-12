import { NodeContext } from "@medley-js/core";
import {
  CLink,
  CNode,
  constants,
  CPort,
  CType,
  TEditNodeComponentProps
} from "@medley-js/common";
import React from "react";
import { CompositeNode } from "../CompositeNode";
import {
  Connection,
  Edge,
  Elements,
  Node as RFNode,
  OnLoadParams,
} from "react-flow-renderer";
import { EditStore } from "../stores/EditStore";
import { ReactFlowStore } from "../stores/ReactFlowStore";
import { runInAction } from "mobx";

export function getReactFlowEvents(reactFlowStore:ReactFlowStore, {context, host}: TEditNodeComponentProps<CompositeNode>,
editStore: EditStore) {
  const onConnect = (edge: Connection | Edge) => {
    context.medley.links.addLink({
      source: edge.source || "",
      target: edge.target || "",
      port: edge.targetHandle || "",
      scope: context.node.id,
    });
  };

  const onLoad: (instance:OnLoadParams) => void = (instance)=>{
    reactFlowStore.reactFlowInstance = instance;
    runInAction(()=>{
      console.log("asd")
      instance.fitView();
    })
  }

  const onNodeDragStop: (
    event: React.MouseEvent<Element, MouseEvent>,
    node: RFNode<any>
  ) => void = (_, rfNode) => {
    const mNode = context.medley.nodes.getNode(rfNode.id);
    if (mNode) {
      const pos = rfNode.position;
      mNode.position = [pos.x,pos.y];
    }
  };

  const onElementsRemove: (elements: Elements<any>) => void = (elements) => {
    if (elements) {
      elements.forEach(async (el) => {
        const edge = el as Edge;
        if (edge.source) {
          const link = context.medley.links.getLink(
            edge.targetHandle || "",
            edge.target,
            edge.source
          );
          if (link) {
            context.medley.links.deleteLink(link);
          }
        } else {
          const node = context.medley.nodes.getNode(el.id);
          if (node == null) {
            return;
          }
          const links = context.medley.links.getLinks();
          for (const l of links) {
            if (l.source === node.id || l.target === node.id) {
              context.medley.links.deleteLink(l);
            }
          }
          context.medley.nodes.deleteNode(node);
        }
      });
    }
  };

  return { onConnect, onNodeDragStop, onElementsRemove,onLoad };
}
