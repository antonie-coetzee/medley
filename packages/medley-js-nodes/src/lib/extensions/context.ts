import { CBaseContext, CLink, CMedleyTypes, CNode } from "@medley-js/common";
import { NodeContext, Node, MedleyTypes, BaseContext } from "@medley-js/core";
import { isObservable, observable } from "mobx";

declare module "@medley-js/core" {
  interface NodeContext<TNode extends MT["node"], MT extends MedleyTypes> {
    get observableNode():TNode;
  }
  interface LinkContext<TLink extends MT["link"], MT extends MedleyTypes> {
    get observableLink():TLink;
  }
}

Object.defineProperty(NodeContext.prototype, "observableNode", {
  get(this: NodeContext<CNode, CMedleyTypes>){
    if(isObservable(this.node)){
      return this.node;
    }
    this.node = getObservableNode(this, this.node);
    return this.node;
  }
})

function getObservableNode(context: CBaseContext, node: CNode) : CNode{
  if(isObservable(node)){
    return node;
  }
  const mNode = context.medley.nodes.getNode(node.id) as CNode;
  if(mNode == null){
    node;
  }
  if(isObservable(mNode)){
    return mNode;
  }else{
    const observableNode = observable.object(mNode);
    context.medley.nodes.upsertNode(observableNode);
    return observableNode;
  }    
}

function getObservableLink(context: CBaseContext, link: CLink) : CLink{
  if(isObservable(link)){
    return link;
  }
  const mLink = context.medley.links.getLink(link.source, link.target, link.) as CLink;
  if(mNode == null){
    node;
  }
  if(isObservable(mNode)){
    return mNode;
  }else{
    const observableNode = observable.object(mNode);
    context.medley.nodes.upsertNode(observableNode);
    return observableNode;
  }    
}