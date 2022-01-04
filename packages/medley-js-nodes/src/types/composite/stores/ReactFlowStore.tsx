import {
  CLink,
  CMedley,
  CMedleyTypes,
  CNode,
  constants,
  DecorateLink,
  DecorateNode,
  Host,
  LinkProps,
  TLinkComponent,
  TLinkComponentProps,
  TNodeComponent,
  TNodeComponentProps
} from "@medley-js/common";
import { BaseContext, isPortLink, Medley, NodeContext, PortLink } from "@medley-js/core";
import { debounce } from "@mui/material";
import { makeAutoObservable, observable, runInAction } from "mobx";
import { observer } from "mobx-react";
import React, { memo, ReactNode, VFC } from "react";
import { Connection, Edge, Elements, Node as RFNode, OnLoadParams, Position, ReactFlowProps } from "react-flow-renderer";
import { NodeStore } from ".";
import { CompositeNode } from "../CompositeNode";
import { onLinksChange, onNodesChange } from "../extensions";
import { EditStore } from "./EditStore";

export class ReactFlowStore {
  public reactFlowInstance: OnLoadParams | null = null;
  public reactFlowProps: ReactFlowProps | null = null;
  private compositeScope: CMedley;

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
    const context = this.context;
    const openNodeEdit = (_ctx: BaseContext<CMedleyTypes>, node: CNode) => {
      this.editStore.editNode(node);
    };
    const host = {
      ...this.host,
      openNodeEdit: this.host.openNodeEdit || openNodeEdit,
    };
    this.updateReactFlow();
    this.nodeStore.updatePorts();
    this.registerMedleyEvents();
  }

  updateReactFlowProps(reactFlowProps: ReactFlowProps) {
    const props = { ...this.reactFlowProps, ...reactFlowProps };
    this.reactFlowProps = props;
  }

  async updateReactFlow(){
    const context = this.context;
    const elements = await this.getReactFlowElements(context);
    const { nodeTypes, edgeTypes } = await this.getReactFlowTypes(context, this.host);
    const events = this.getReactFlowEvents();
    this.nodeStore.updatePorts();
    this.updateReactFlowProps({ elements, nodeTypes, edgeTypes, ...events });
  }

  private registerMedleyEvents() {
    
    const debouncedUpdateState = debounce(async () => {
      this.updateReactFlow();
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
  
    const onLoad: (instance: OnLoadParams) => void = (instance) => {
      this.reactFlowInstance = instance;
      runInAction(() => {
        instance.fitView();
      });
    };
  
    const onNodeDragStop: (
      event: React.MouseEvent<Element, MouseEvent>,
      node: RFNode<any>
    ) => void = (_, rfNode) => {
      const mNode = this.compositeScope.nodes.getNode(rfNode.id);
      if (mNode) {
        const pos = rfNode.position;
        this.editStore.moveNode(mNode, [pos.x, pos.y], ()=>this.updateReactFlow());
      }
    };
  
    const onElementsRemove: (elements: Elements<any>) => void = (elements) => {
      if (elements) {
        elements.forEach(async (el) => {
          const edge = el as Edge;
          if (edge.source) {
            const link = this.compositeScope.links.getLink(     
              edge.source,
              edge.target,
              edge.targetHandle || undefined
            );
            if (link) {
              this.editStore.removeLink(link)
            }
          } else {
            const node = this.context.compositeScope.nodes.getNode(el.id);
            if (node == null) {
              return;
            }
            this.compositeScope.nodes.deleteNode(node.id);
            const links = this.compositeScope.links.getLinks().filter(l=>l.source === node.id || l.target === node.id)
            this.editStore.removeNode(node, links);
          }
        });
      }
    };
  
    return { onConnect, onNodeDragStop, onElementsRemove, onLoad };
  }

  async getReactFlowElements(
    contex: NodeContext<CompositeNode, CMedleyTypes>
  ) {
    const reactFlowNodes = await this.getReactFlowNodes(contex);
    const reactFlowEdges = await this.getReactFlowEdges(contex);
    return [...reactFlowNodes, ...reactFlowEdges];
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

  async getReactFlowEdges(context: NodeContext<CompositeNode, CMedleyTypes>): Promise<Edge[]> {
    const mLinks = context.compositeScope.links.getLinks();
    const edges = await Promise.all(
      mLinks.filter(l=>isPortLink(l)).map(async (l) => {
        const pLink = l as PortLink;
        const node = context.compositeScope.nodes.getNode(pLink.source);
        if (node == null) {
          return;
        }
        const decorateLink = await context.compositeScope.types.getExport<DecorateLink>(
          node.type,
          constants.decorateLink
        );
        const linkComponent = await context.compositeScope.types.getExport<TLinkComponent>(
          node.type,
          constants.LinkComponent
        );
        const nodeContext = new NodeContext(context.compositeScope, node);
        const linkProps = await decorateLink?.(nodeContext);
        return {
          data: { context: nodeContext, link:pLink },
          id: `${pLink.scope}${pLink.source}${pLink.target}${pLink.port}`,
          source: pLink.source,
          target: pLink.target,
          targetHandle: pLink.port,
          type: linkComponent && node.type,
          ...linkProps,
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
        const nodeComponent = await context.medley.types.getExport<
          TNodeComponent<CNode>
        >(typeName, constants.NodeComponent);
        const linkComponent = await context.medley.types.getExport<
          TLinkComponent<CNode>
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
            memo(observer(crnt.linkComponent))
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
  const linkedNodes = context.medley.links.getSourceLinks(context.node.id).map((sl) => {
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
        <NodeComponent
          context={nodeContext}
          host={host}
          selected={props.selected}
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
  LinkComponent: React.VFC<TLinkComponentProps>
) {
  const linkWrapper: VFC<
    Omit<LinkProps, "data"> & {
      data: {
        context: NodeContext<CNode, CMedleyTypes>;
        link: CLink;
      };
    }
  > = (props) => {
    const context = props.data.context;
    const linkProps = { ...props, data: props.data.link };
    if (context) {
      return (
        <LinkComponent
          context={context}
          host={host}
          linkProps={linkProps}
        />
      );
    } else {
      return null;
    }
  };
  return linkWrapper;
}
