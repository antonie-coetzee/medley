import { makeAutoObservable, observable, runInAction } from "mobx";
import { BaseContext, NodeContext } from "@medley-js/core";
import {
  CMedleyTypes,
  CNode,
  Host,
  TEditNodeComponentProps,
} from "@medley-js/common";
import { CompositeNode } from "../CompositeNode";
import { OnLoadParams, ReactFlowProps } from "react-flow-renderer";
import { getReactFlowElements } from "../util/getReactFlowElements";
import { getReactFlowTypes } from "../util/getReactFlowNodeTypes";
import { debounce } from "@mui/material";
import { getReactFlowEvents } from "../util";
import { EditStore } from "./EditStore";
import { NodeStore } from ".";
import { onNodeInsert, onNodesChange } from "../extensions";
import { InputType } from "../scopedTypes/input";
import { OutputType } from "../scopedTypes/output";
import { InputNode } from "../scopedTypes/input/InputNode";
import { OutputNode } from "../scopedTypes/output/node";

export class ReactFlowStore {
  public reactFlowInstance: OnLoadParams | null = null;
  public reactFlowProps: ReactFlowProps | null = null;

  constructor(
    private context: NodeContext<CompositeNode, CMedleyTypes>,
    private editStore: EditStore,
    private nodeStore: NodeStore,
    private host: Host
  ) {
    makeAutoObservable(this, { reactFlowProps: observable.ref });
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
    const { nodeTypes, edgeTypes } = await getReactFlowTypes(context, host);
    const elements = await getReactFlowElements(context);
    const events = getReactFlowEvents(this, context);
    this.updateReactFlowProps({ elements, nodeTypes, edgeTypes, ...events });
    this.registerMedleyEvents();
  }

  updateReactFlowProps(reactFlowProps: ReactFlowProps) {
    const props = { ...this.reactFlowProps, ...reactFlowProps };
    this.reactFlowProps = props;
  }

  private registerMedleyEvents() {
    const context = this.context;
    const debouncedUpdateState = debounce(async () => {
      const elements = await getReactFlowElements(context);
      const nodeTypes = await getReactFlowTypes(context, this.host);
      this.nodeStore.inputNodes = context.medley.nodes
        .getNodes()
        .filter((n) => n.type === InputType.name) as InputNode[];
      this.nodeStore.outputNodes = context.medley.nodes
        .getNodes()
        .filter((n) => n.type === OutputType.name) as OutputNode[];

      this.updateReactFlowProps({ elements, nodeTypes });
    }, 50);

    const medley = this.nodeStore.compositeScope;
    if (medley.nodes[onNodesChange] == null) {
      medley.nodes[onNodesChange] = () => {
        debouncedUpdateState();
      };
    }
  }
}
