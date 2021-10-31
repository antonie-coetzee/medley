import { makeAutoObservable, observable } from "mobx";
import { EventType } from "@medley-js/core";
import { TNodeEditComponentProps } from "@medley-js/common";
import { CompositeNode } from "../CompositeNode";
import { OnLoadParams, ReactFlowProps } from "react-flow-renderer";
import { getReactFlowElements } from "../util/getReactFlowElements";
import { getReactFlowNodeTypes } from "../util/getReactFlowNodeTypes";
import { debounce } from "@mui/material";
import { getReactFlowEvents } from "../util";
import { EditStore } from "./EditStore";

export class ReactFlowStore {
  public reactFlowInstance: OnLoadParams | null = null;
  public reactFlowProps: ReactFlowProps | null = null;

  constructor(private props: TNodeEditComponentProps<CompositeNode>, private editStore:EditStore) {
    makeAutoObservable(this, {reactFlowProps:observable.ref, reactFlowInstance: false});
    this.initialize(); 
  }

  async initialize(){
    const context = this.props.context;
    const nodeTypes = await getReactFlowNodeTypes(context, this.props.host);
    const elements = await getReactFlowElements(context);
    const events = getReactFlowEvents(this.props, this.editStore);
    const onLoad = (rFI:OnLoadParams)=>{
      this.reactFlowInstance = rFI;
    }
    this.updateReactFlowProps({elements, nodeTypes, ...events, onLoad});
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
      const nodeTypes = await getReactFlowNodeTypes(context, this.props.host);
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
