import { CMedleyTypes } from "@medley-js/common";
import { Medley, NodeContext } from "@medley-js/core";
import { isObservable, makeAutoObservable, observable } from "mobx";
import { CompositeNode } from "../node";
import { InputType } from "../scopedTypes/input";
import { InputNode } from "../scopedTypes/input/InputNode";
import { OutputType } from "../scopedTypes/output";
import { OutputNode } from "../scopedTypes/output/node";

export class NodeStore {
  public inputNodes: InputNode[] = [];
  public outputNodes: OutputNode[] = [];
  public compositeScope: Medley<CMedleyTypes>;
  public parentScope: Medley<CMedleyTypes>;

  constructor(context: NodeContext<CompositeNode, CMedleyTypes>) {
    makeAutoObservable(this, { compositeScope: false });
    this.compositeScope = context.compositeScope;
    this.parentScope = context.medley;
  }

  updatePorts() {
    console.log("update ports");
    this.inputNodes = this.compositeScope.nodes
      .getNodes()
      .filter((n) => n.type === InputType.name)
      .map(n=>{
        if(isObservable(n)){
          return n;
        }else{
          const observableNode = observable.object(n);
          this.compositeScope.nodes.upsertNode(observableNode);
          return observableNode;
        }
      }) as InputNode[];
    this.outputNodes = this.compositeScope.nodes
      .getNodes()
      .filter((n) => n.type === OutputType.name) as OutputNode[];
  }
}
