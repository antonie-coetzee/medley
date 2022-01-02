import { CMedleyTypes, CNode } from "@medley-js/common";
import { NodeContext, Node, MedleyTypes } from "@medley-js/core";
import { isObservable, observable } from "mobx";

declare module "@medley-js/core" {
  interface NodeContext<TNode extends MT["node"], MT extends MedleyTypes> {
    getNodeMetaData: <T>(key: symbol, provider?:(context:NodeContext<TNode,MT>)=>T) => T;
    get observableNode():TNode;
  }

  interface Node {
    [key:symbol]: unknown;
  }
}

NodeContext.prototype.getNodeMetaData = function <T>(this: NodeContext, key: symbol, provider?:(context:NodeContext)=>T) {
  if(this.node[key] == null && provider){
    this.node[key] = provider(this);
  }
  return this.node[key] as T;
};


Object.defineProperty(NodeContext.prototype, "observableNode", {
  get(this: NodeContext<CNode, CMedleyTypes>){
    if(isObservable(this.node)){
      return this.node;
    }
    const node = this.medley.nodes.getNode(this.node.id) as CNode;
    if(node == null){
      this.node;
    }
    if(isObservable(node)){
      this.node = node;
      return this.node;
    }else{
      const observableNode = observable.object(node);
      this.medley.nodes.upsertNode(observableNode);
      this.node = observableNode;
      return observableNode;
    }    
  }
})