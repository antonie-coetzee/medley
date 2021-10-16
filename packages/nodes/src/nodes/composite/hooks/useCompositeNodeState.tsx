import { ReactNode, useEffect, useState } from "react";
import { EventType, NodeContext } from "@medley-js/core";
import { CLink, CNode, CType } from "@medley-js/common";
import { CompositeNode } from "../node";
import { Edge, Node as RFNode } from "react-flow-renderer";
import { getReactFlowElements } from "../util/getReactFlowElements";
import { getReactFlowNodeTypes } from "../util/getReactFlowNodeTypes";

export function useCompositeNodeState(
  contex: NodeContext<CompositeNode, CNode, CType, CLink>,
  initialState: {
    elements: (Edge<any> | RFNode<any>)[];
    nodeTypes: { [index: string]: ReactNode };
  }
) {
  const [rfState, setRfState] = useState(initialState);

  useEffect(() => {
    contex.medley.nodes.addEventListener(EventType.OnChange, async (e) => {
      const elements = await getReactFlowElements(contex);
      const nodeTypes = await getReactFlowNodeTypes(contex);
      setRfState({ elements, nodeTypes });
    });

    contex.medley.links.addEventListener(EventType.OnChange, async (e) => {
      const elements = await getReactFlowElements(contex);
      const nodeTypes = await getReactFlowNodeTypes(contex);
      setRfState({ elements, nodeTypes });
    });
  }, []);

  return rfState;
}
