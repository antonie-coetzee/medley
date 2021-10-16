import { ReactNode, useEffect, useState } from "react";
import { EventType, NodeContext } from "@medley-js/core";
import { CLink, CNode, CType } from "@medley-js/common";
import { CompositeNode } from "../node";
import { Edge, Node as RFNode } from "react-flow-renderer";
import { getReactFlowElements } from "../util/getReactFlowElements";
import { getReactFlowNodeTypes } from "../util/getReactFlowNodeTypes";
import { debounce } from "@mui/material";

export function useCompositeNodeState(
  contex: NodeContext<CompositeNode, CNode, CType, CLink>,
  initialState: {
    elements: (Edge<any> | RFNode<any>)[];
    nodeTypes: { [index: string]: ReactNode };
  }
) {
  const [rfState, setRfState] = useState(initialState);
  
  useEffect(() => {
    const debouncedUpdateState = debounce(async ()=>{
      const elements = await getReactFlowElements(contex);
      const nodeTypes = await getReactFlowNodeTypes(contex);
      setRfState({ elements, nodeTypes });
    }, 50)
    contex.medley.nodes.addEventListener(EventType.OnChange, async (e) => {
      debouncedUpdateState();
    });

    contex.medley.links.addEventListener(EventType.OnChange, async (e) => {
      debouncedUpdateState();
    });
  }, []);

  return rfState;
}
