import { NodeContext } from "@medley-js/core";
import { CMedleyTypes } from "@medley-js/common";
import React from "react";
import { CompositeNode } from "../CompositeNode";
import {
  Connection,
  Edge,
  Elements,
  Node as RFNode,
  OnLoadParams,
} from "react-flow-renderer";
import { ReactFlowStore } from "../stores/ReactFlowStore";
import { runInAction } from "mobx";

export function getReactFlowEvents(
  reactFlowStore: ReactFlowStore,
  context: NodeContext<CompositeNode, CMedleyTypes>
) {
  const onConnect = (edge: Connection | Edge) => {
    console.log(edge);
    context.compositeScope.links.upsertLink({
      source: edge.source || "",
      target: edge.target || "",
      port: edge.targetHandle || "",
      scope: context.node.id,
    });
  };

  const onLoad: (instance: OnLoadParams) => void = (instance) => {
    reactFlowStore.reactFlowInstance = instance;
    runInAction(() => {
      instance.fitView();
    });
  };

  const onNodeDragStop: (
    event: React.MouseEvent<Element, MouseEvent>,
    node: RFNode<any>
  ) => void = (_, rfNode) => {
    const mNode = context.compositeScope.nodes.getNode(rfNode.id);
    if (mNode) {
      const pos = rfNode.position;
      mNode.position = [pos.x, pos.y];
    }
  };

  const onElementsRemove: (elements: Elements<any>) => void = (elements) => {
    if (elements) {
      elements.forEach(async (el) => {
        const edge = el as Edge;
        if (edge.source) {
          const link = context.compositeScope.links.getLink(
            edge.targetHandle || "",
            edge.target,
            edge.source
          );
          if (link) {
            context.compositeScope.links.deleteLink(link);
          }
        } else {
          const node = context.compositeScope.nodes.getNode(el.id);
          if (node == null) {
            return;
          }
          const links = context.compositeScope.links.getLinks();
          for (const l of links) {
            if (l.source === node.id || l.target === node.id) {
              context.compositeScope.links.deleteLink(l);
            }
          }
          context.compositeScope.nodes.deleteNode(node.id);
        }
      });
    }
  };

  return { onConnect, onNodeDragStop, onElementsRemove, onLoad };
}
