import React, { memo, ReactNode, useContext, useState, VFC } from "react";
import ReactFlow, {
  addEdge,
  Connection,
  Controls,
  Edge,
  Elements,
  MiniMap,
  Node as RFNode,
  Position,
} from "react-flow-renderer";
import { BaseContext, NodeContext } from "medley";
import {
  CLink,
  CNode,
  constants,
  CType,
  GetNodeComponent,
  GetNodeEditComponent,
  NodeComponentProps,
} from "medley-common";
import { CompositeNode } from "./node";

export const getNodeEditComponent: GetNodeEditComponent<CompositeNode> = async (
  contex: NodeContext<CompositeNode, CNode, CType, CLink>
) => {
  const reactFlowTypes = await getReactFlowNodeTypes(contex);
  const reactFlowNodes = getReactFlowNodes(contex);
  const reactFlowEdges = getReactFlowEdges(contex);
  const initialElements = [...reactFlowNodes, ...reactFlowEdges];
  return () => {
    const [elements, setElements] = useState<Elements>(initialElements);
    contex.medley.links.events.onChange = links => {
      const reactFlowNodes = getReactFlowNodes(contex);
      const reactFlowEdges = getReactFlowEdges(contex);
      setElements([...reactFlowNodes, ...reactFlowEdges]);
    }
    contex.medley.nodes.events.onChange = nodes => {
      const reactFlowNodes = getReactFlowNodes(contex);
      const reactFlowEdges = getReactFlowEdges(contex);
      setElements([...reactFlowNodes, ...reactFlowEdges]);
    }
    const onConnect = (edge: Connection | Edge) => contex.medley.links.addLink({source:edge.source || "", target:edge.target || "", port: edge.targetHandle || "" , scope: contex.node.id});
    return (
    <div style={{ height: 600 }}>
      <ReactFlow
        elements={elements}
        nodeTypes={reactFlowTypes}
        onConnect={onConnect}
        onNodeDragStop={(_, rfNode)=>{
          const mNode = contex.medley.nodes.getNode(rfNode.id);
          if(mNode){
            mNode.position = rfNode.position;           
          }     
        }}
      >
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
    )
  };
};

async function getReactFlowNodeTypes(
  contex: BaseContext<CNode>
): Promise<{ [index: string]: ReactNode }> {
  const typeNames = contex.medley.nodes.getUsedTypes();
  const nodeTypes = await Promise.all(
    typeNames.map(async (typeName) => {
      const getNodeComponent:
        | GetNodeComponent
        | undefined = await contex.medley.types.getExportFunction(
        typeName,
        constants.getNodeComponent
      );
      return { typeName, nodeComponent: await getNodeComponent?.(contex) };
    })
  );
  return nodeTypes.reduce((acc, crnt) => {
    if (crnt.nodeComponent) {
      acc[crnt.typeName] = wrapNodeComponent((contex as unknown) as BaseContext, crnt.nodeComponent);
    }
    return acc;
  }, {} as { [index: string]: ReactNode });
}

function wrapNodeComponent(
  contex: BaseContext,
  NodeComponent: React.VFC<NodeComponentProps>
) {
  const nodeWrapper: VFC<{
    id: string;
    data: any;
    selected: boolean;
    sourcePosition: string;
    targetPosition: string;
  }> = memo((props) => {
    const node = contex.medley.nodes.getNode(props.id);
    return node ? (
      <NodeComponent
        logger={contex.logger}
        medley={contex.medley}
        node={node}
        {...props}
      />
    ) : null;
  });
  return nodeWrapper;
}

function getReactFlowNodes(context: BaseContext<CNode>): RFNode[] {
  const mNodes = context.medley.nodes.getNodes();
  return mNodes.map((mNode) => ({
    id: mNode.id,
    position: { x: mNode.position?.x || 0, y: mNode.position?.y || 0 },
    type: mNode.type,
    selectable: true,
    draggable: true,
    connectable: true,
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  }));
}

function getReactFlowEdges(context: BaseContext<CNode>): Edge[] {
  const mLinks = context.medley.links.getLinks();
  return mLinks.map((mLink) => ({
    id: `${mLink.scope}${mLink.source}${mLink.target}${mLink.port}`,
    source: mLink.source,
    target: mLink.target,
    animated: true
  }));
}
