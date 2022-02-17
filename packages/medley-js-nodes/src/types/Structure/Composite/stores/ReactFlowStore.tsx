import {
  CLink,
  CMedley,
  CMedleyTypes,
  CNode,
  constants,
  DecorateNode,
  Host,
  LinkProps,
  TLinkComponent,
  TLinkComponentProps,
  TNodeComponent,
  TNodeComponentProps,
} from "@medley-js/common";
import {
  isPortLink,
  LinkContext,
  NodeContext,
  PortLink,
} from "@medley-js/core";
import { debounce } from "@mui/material";
import { makeAutoObservable, observable } from "mobx";
import { observer } from "mobx-react";
import React, { ComponentType, memo, ReactNode, VFC } from "react";
import {
  BezierEdge,
  Connection,
  Edge,
  EdgeProps,
  Node as RFNode,
  Position,
  ReactFlowProps,
} from "react-flow-renderer";
import { NodeStore } from ".";
import { NodeContainer } from "../components";
import { onLinksChange, onNodesChange, onTypeUpsert } from "../extensions";
import { CompositeNode } from "../node";
import { EditStore } from "./EditStore";

export class ReactFlowStore {
  public reactFlowProps: ReactFlowProps | null = null;
  private compositeScope: CMedley;
  private nodeTypesId: string = "";
  private edgeTypesId: string = "";

  constructor(
    private context: NodeContext<CompositeNode, CMedleyTypes>,
    private editStore: EditStore,
    private nodeStore: NodeStore,
    private host: Host
  ) {
    makeAutoObservable(this, { reactFlowProps: observable.ref });
    this.compositeScope = context.compositeScope;
    this.initialize();
  }

  async initialize() {
    this.registerMedleyEvents();
    this.updateReactFlow();
    -this.nodeStore.updatePorts();
  }

  updateReactFlowProps(reactFlowProps: ReactFlowProps) {
    const props = {
      ...this.reactFlowProps,
      ...reactFlowProps,
    };
    this.reactFlowProps = props;
  }

  async updateReactFlow() {
    const context = this.context;
    const elements = await this.getReactFlowElements(context);
    const { nodeTypes, edgeTypes } = await this.getReactFlowTypes(
      context,
      this.host
    );
    const events = this.getReactFlowEvents();
    this.updateReactFlowProps({ ...elements, nodeTypes, edgeTypes, ...events });
  }

  private registerMedleyEvents() {
    const debouncedUpdateState = debounce(async () => {
      this.updateReactFlow();
      this.nodeStore.updatePorts();
    }, 50);

    const medley = this.nodeStore.compositeScope;
    if (medley.nodes[onNodesChange] == null) {
      medley.nodes[onNodesChange] = () => {
        debouncedUpdateState();
      };
    }
    if (medley.links[onLinksChange] == null) {
      medley.links[onLinksChange] = () => {
        debouncedUpdateState();
      };
    }
    if (medley.types[onTypeUpsert] == null) {
      medley.types[onTypeUpsert] = (type) => {
        this.nodeTypesId = medley.idGenerator(() => false);
        this.edgeTypesId = medley.idGenerator(() => false);
        return type;
      };
    }
  }

  private getReactFlowEvents() {
    const onConnect = (edge: Connection | Edge) => {
      this.editStore.addLink({
        source: edge.source || "",
        target: edge.target || "",
        port: edge.targetHandle || "",
        scope: this.compositeScope.scope,
      });
    };

    const onNodeDragStop: (
      event: React.MouseEvent<Element, MouseEvent>,
      node: RFNode<any>
    ) => void = (_, rfNode) => {
      const mNode = this.compositeScope.nodes.getNode(rfNode.id);
      if (mNode) {
        const pos = rfNode.position;
        this.editStore.moveNode(mNode, [pos.x, pos.y], async () => {});
      }
    };

    return { onConnect, onNodeDragStop };
  }

  async getReactFlowElements(contex: NodeContext<CompositeNode, CMedleyTypes>) {
    const reactFlowNodes = await this.getReactFlowNodes(contex);
    const reactFlowEdges = await this.getReactFlowEdges(contex);
    return { defaultNodes: reactFlowNodes, defaultEdges: reactFlowEdges };
  }

  getReactFlowNodes(
    context: NodeContext<CompositeNode, CMedleyTypes>
  ): Promise<RFNode[]> {
    const mNodes = getNodes(context);
    /* combine props with node type's props */
    return Promise.all(
      mNodes.map(async (node) => {
        const nodeContext = new NodeContext(context.compositeScope, node);
        const nodeProps = await context.compositeScope.types.runExportFunction<
          DecorateNode<CNode>
        >(node.type, constants.decorateNode, nodeContext);
        const props = {
          selectable: true,
          draggable: true,
          connectable: true,
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
          dragHandle: ".drag-handle",
          ...nodeProps,
        };
        return {
          data: nodeContext,
          id: node.id,
          position: { x: node.position?.[0] || 0, y: node.position?.[1] || 0 },
          type: node.type,
          selectable: props.selectable,
          draggable: props.draggable,
          connectable: props.connectable,
          sourcePosition: props.sourcePosition as Position,
          targetPosition: props.targetPosition as Position,
          dragHandle: props.dragHandle,
        };
      })
    );
  }

  async getReactFlowEdges(
    context: NodeContext<CompositeNode, CMedleyTypes>
  ): Promise<Edge[]> {
    const mLinks = context.compositeScope.links.getLinks();
    const edges = await Promise.all(
      mLinks
        .filter((l) => isPortLink(l))
        .map(async (l) => {
          const pLink = l as PortLink;
          const node = context.compositeScope.nodes.getNode(pLink.source);
          if (node == null) {
            return;
          }
          const linkComponent = await context.compositeScope.types.getExport<TLinkComponent>(
            node.type,
            constants.LinkComponent
          );
          const linkContext = new LinkContext(context.compositeScope, pLink);
          return {
            data: { context: linkContext, link: pLink },
            id: `${pLink.scope}${pLink.source}${pLink.target}${pLink.port}`,
            source: pLink.source,
            target: pLink.target,
            targetHandle: pLink.port,
            type: linkComponent && node.type,
          };
        })
    );
    return edges.filter((n) => n !== undefined) as Edge[];
  }

  async getReactFlowTypes(
    context: NodeContext<CompositeNode, CMedleyTypes>,
    host: Host
  ): Promise<{
    nodeTypes: { [index: string]: ReactNode };
    edgeTypes: { [index: string]: ReactNode };
  }> {
    const typeNames = [
      ...new Set([
        ...getNodes(context).map((n) => n.type),
        ...["$input", "$output"],
      ]),
    ];
    const types = await Promise.all(
      typeNames.map(async (typeName) => {
        const nodeComponent = await context.compositeScope.types.getExport<
          TNodeComponent<CNode>
        >(typeName, constants.NodeComponent);
        const linkComponent = await context.compositeScope.types.getExport<
          TLinkComponent<CLink>
        >(typeName, constants.LinkComponent);
        return { typeName, nodeComponent, linkComponent };
      })
    );
    const wrappedTypes = types.reduce(
      (acc, crnt) => {
        if (crnt.nodeComponent) {
          acc.nodeTypes[crnt.typeName] = wrapNodeComponent(
            host,
            memo(observer(crnt.nodeComponent))
          );
        }
        if (crnt.linkComponent) {
          acc.edgeTypes[crnt.typeName] = wrapLinkComponent(
            host,
            memo(observer(crnt.linkComponent)),
            BezierEdge
          );
        }
        return acc;
      },
      { nodeTypes: {}, edgeTypes: {} } as {
        nodeTypes: { [index: string]: ReactNode };
        edgeTypes: { [index: string]: ReactNode };
      }
    );

    return wrappedTypes;
  }
}

function getNodes(context: NodeContext<CompositeNode, CMedleyTypes>) {
  /* nodes linked to the current scope */
  const linkedNodes = context.medley.links
    .getSourceLinks(context.node.id)
    .map((sl) => {
      const linkedNode = context.medley.nodes.getNode(sl.target);
      if (linkedNode) {
        /* use link's position on node */
        return { ...linkedNode, ...sl.position };
      }
    });
  /* nodes belonging to the composite scope */
  const scopeNodes = context.compositeScope.nodes.getNodes();
  const mNodes = linkedNodes
    .filter((n) => n !== undefined)
    .concat(...scopeNodes) as CNode[];
  return mNodes;
}

function wrapNodeComponent(
  host: Host,
  NodeComponent: React.VFC<TNodeComponentProps>
) {
  const nodeWrapper: VFC<{
    id: string;
    data: NodeContext<CNode, CMedleyTypes>;
    selected: boolean;
    sourcePosition: string;
    targetPosition: string;
  }> = (props) => {
    const nodeContext = props.data;
    if (nodeContext) {
      return (
        <NodeContainer
          context={nodeContext}
          host={host}
          selected={props.selected}
          NodeComponent={NodeComponent}
        />
      );
    } else {
      return null;
    }
  };
  return nodeWrapper;
}

function wrapLinkComponent(
  host: Host,
  LinkComponent: React.VFC<TLinkComponentProps>,
  DefaultLinkComponent: ComponentType<LinkProps>
) {
  const linkWrapper: VFC<
    EdgeProps & {
      data: {
        context: LinkContext<CLink, CMedleyTypes>;
      };
    }
  > = (props) => {
    const context = props.data.context;
    if (context) {
      return (
        <LinkComponent
          context={context}
          host={host}
          linkProps={props}
          DefaultLinkComponent={DefaultLinkComponent}
        />
      );
    } else {
      return <DefaultLinkComponent {...props} />;
    }
  };
  return linkWrapper;
}
