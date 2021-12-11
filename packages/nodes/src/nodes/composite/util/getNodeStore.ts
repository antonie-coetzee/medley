import { makeAutoObservable } from "mobx";
import { CNode, setNodeMetaData, getNodeMetaData, TEditNodeComponentProps} from "@medley-js/common";
import { InputNode } from "../scopedTypes/input/InputNode";
import { OutputNode } from "../scopedTypes/output/node";
import { Medley, NodeContext } from "@medley-js/core";
import { InputType } from "../scopedTypes/input";
import { OutputType } from "../scopedTypes/output";

import { observable, isObservable, toJS } from "mobx";


export class NodeStore {
  public inputNodes: InputNode[] = [];
  public outputNode: OutputNode | undefined;

  constructor(private nodeContext:NodeContext<CNode>) {
    makeAutoObservable(this);
  }

  static get(nodeContext:NodeContext<CNode>){
    let nodeStore = getNodeMetaData<NodeStore>(nodeContext.node);
    if(nodeStore == null){
        nodeStore = new NodeStore(nodeContext);
        nodeStore.updateNodeInterface()
        setNodeMetaData(nodeContext.node, nodeStore);
        return nodeStore;
    }else{
        return nodeStore
    }
  }

  public updateNodeInterface(){
    const context = this.nodeContext;
    const scopedInstance = Medley.getScopedInstance(context.medley, context.node.id);
    const inputNodes = scopedInstance.nodes
      .getNodesByType<InputNode>(InputType.name)
      .sort((a, b) => a.name.localeCompare(b.name));
    const outputNodes = scopedInstance.nodes
      .getNodesByType<OutputNode>(OutputType.name)
      .sort((a, b) => a.name.localeCompare(b.name));
    
    this.inputNodes = inputNodes;
    this.outputNode = outputNodes[0];

  }
}
