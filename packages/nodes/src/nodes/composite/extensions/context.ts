import { CMedleyTypes, CNode } from "@medley-js/common";
import { MedleyTypes, NodeContext } from "@medley-js/core";
import { createCompositeScope } from "./util/createCompositeScope";

const compositeScopeKey = Symbol("compositeScopeKey");

declare module "@medley-js/core" {
  interface NodeContext<TNode extends MT["node"], MT extends MedleyTypes> {
    get compositeScope():Medley<MT>;
  }
}

Object.defineProperty(NodeContext.prototype, "compositeScope", {
  get(this: NodeContext<CNode, CMedleyTypes>){
    if(this.node[compositeScopeKey]){
      return this.node[compositeScopeKey];
    }
    const compositeScope = createCompositeScope(this.medley, this.node.id)
    this.node[compositeScopeKey] = compositeScope;
    return compositeScope;
  }
});