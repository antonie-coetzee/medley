import { CMedleyTypes } from "@medley-js/common";
import { Medley, NodeContext } from "@medley-js/core";
import { makeAutoObservable } from "mobx";
import { CompositeNode } from "../CompositeNode";
import { InputType } from "../scopedTypes/input";
import { InputNode } from "../scopedTypes/input/InputNode";
import { OutputType } from "../scopedTypes/output";
import { OutputNode } from "../scopedTypes/output/node";

export class NodeStore {
  public inputNodes: InputNode[] = [];
  public outputNodes: OutputNode[] = [];
  public compositeScope: Medley<CMedleyTypes>;

  constructor(context: NodeContext<CompositeNode, CMedleyTypes>) {
    makeAutoObservable(this, { compositeScope: false });
    this.compositeScope = context.compositeScope;
  }

  updatePorts() {
    this.inputNodes = this.compositeScope.nodes
      .getNodes()
      .filter((n) => n.type === InputType.name) as InputNode[];
    this.outputNodes = this.compositeScope.nodes
      .getNodes()
      .filter((n) => n.type === OutputType.name) as OutputNode[];
  }
}
