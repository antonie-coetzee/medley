import { CBaseContext, CLink, CMedleyTypes, CNode } from "@medley-js/common";
import { LinkContext, MedleyTypes, NodeContext } from "@medley-js/core";
import { isObservable, observable } from "mobx";

declare module "@medley-js/core" {
  interface NodeContext<TNode extends MT["node"], MT extends MedleyTypes> {
    get observableNode():TNode;
  }
  interface LinkContext<TLink extends MT["link"], MT extends MedleyTypes> {
    get observableLink():TLink;
    getObservableNode: <TNode extends CNode = CNode>() => TNode;
  }
}

Object.defineProperty(NodeContext.prototype, "observableNode", {
  get(this: NodeContext<CNode, CMedleyTypes>){
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

Object.defineProperty(LinkContext.prototype, "observableLink", {
  get(this: LinkContext<CLink, CMedleyTypes>){
    this.link = getObservableLink(this, this.link);
    return this.link;
  }
})

LinkContext.prototype.getObservableNode = function <TNode extends CNode = CNode>(this: LinkContext<CLink, CMedleyTypes>){
    const node = this.medley.nodes.getNode(this.link.source);
    if(node){
      return getObservableNode(this, node) as TNode;
    }else{
      throw new Error("source node not found for link");
    }
  }


function getObservableLink(context: CBaseContext, link: CLink) : CLink{
  if(isObservable(link)){
    return link;
  }
  const mLink = context.medley.links.getLink(link.source, link.target, link.port) as CLink;
  if(mLink == null){
    link;
  }
  if(isObservable(mLink)){
    return mLink;
  }else{
    const observableLink = observable.object(mLink);
    context.medley.links.upsertLink(observableLink);
    return observableLink;
  }    
}