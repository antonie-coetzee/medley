import { makeAutoObservable } from "mobx";
import { NodeContext } from "@medley-js/core";
import { CNode, setNodeMetaData, getNodeMetaData } from "@medley-js/common";

export class NodeStore {
  static get(nodeContext: NodeContext<CNode>) {
    let nodeStore = getNodeMetaData<NodeStore>(nodeContext.node);
    if (nodeStore == null) {
      nodeStore = new NodeStore(nodeContext);
      setNodeMetaData(nodeContext.node, nodeStore);
      return nodeStore;
    } else {
      return nodeStore;
    }
  }

  private constructor(private nodeContext: NodeContext<CNode>) {
    makeAutoObservable(this);
  }
}
