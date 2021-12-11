import { makeAutoObservable, observable, runInAction } from "mobx";
import { BaseContext, EventType, Medley } from "@medley-js/core";
import { CNode, TEditNodeComponentProps } from "@medley-js/common";
import { CompositeNode } from "../CompositeNode";
import { OnLoadParams, ReactFlowProps } from "react-flow-renderer";
import { getReactFlowElements } from "../util/getReactFlowElements";
import { getReactFlowTypes } from "../util/getReactFlowNodeTypes";
import { debounce } from "@mui/material";
import { getReactFlowEvents } from "../util";
import { EditStore } from "./EditStore";
import { InputNode } from "../scopedTypes/input/InputNode";
import { InputType } from "../scopedTypes/input";
import { NodeStore } from "../util/getNodeStore";
import { OutputNode } from "../scopedTypes/output/node";
import { OutputType } from "../scopedTypes/output";

export class ReactFlowStore {
  public reactFlowInstance: OnLoadParams | null = null;
  public reactFlowProps: ReactFlowProps | null = null;

  constructor(private props: TEditNodeComponentProps<CompositeNode>, private editStore:EditStore) {
    makeAutoObservable(this, {reactFlowProps:observable.ref});
    this.initialize(); 
  }

  async initialize(){
    const context = this.props.context;
    const openNodeEdit = (_ctx:BaseContext,node:CNode)=>{
      this.editStore.editNode(node);
    }
    const host = {...this.props.host, openNodeEdit: this.props.host.openNodeEdit || openNodeEdit}
    const {nodeTypes, edgeTypes} = await getReactFlowTypes(context, host);
    const elements = await getReactFlowElements(context);
    const events = getReactFlowEvents(this, this.props, this.editStore);
    this.updateReactFlowProps({elements, nodeTypes, edgeTypes, ...events});
    this.registerMedleyEvents();
  }

  updateReactFlowProps(reactFlowProps: ReactFlowProps) {
    const props = {...this.reactFlowProps, ...reactFlowProps}
    this.reactFlowProps = props;
  }

  private registerMedleyEvents() {
    const context = this.props.context;
    const debouncedUpdateState = debounce(async () => {
      const elements = await getReactFlowElements(context);
      const nodeTypes = await getReactFlowTypes(context, this.props.host);
      runInAction(()=>{
        const nodeStore = NodeStore.get(this.props.context);
        nodeStore.updateNodeInterface();
      })
      this.updateReactFlowProps({ elements, nodeTypes });
    }, 50);
    context.medley.nodes.addEventListener(EventType.OnChange, async (e) => {
      debouncedUpdateState();
    });

    context.medley.links.addEventListener(EventType.OnChange, async (e) => {
      debouncedUpdateState();
    });
  }
}
