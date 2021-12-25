import { Medley, NodeContext } from "@medley-js/core";
import { CMedleyTypes } from "@medley-js/common";
import { makeAutoObservable } from "mobx";
import { CompositeNode } from "../CompositeNode";
import { InputNode } from "../scopedTypes/input/InputNode";
import { OutputNode } from "../scopedTypes/output/node";

export class NodeStore {
  public inputNodes: InputNode[] = [];
  public outputNodes: OutputNode[] = [];
  public compositeScope: Medley<CMedleyTypes>;

  constructor(context: NodeContext<CompositeNode, CMedleyTypes>) {
    makeAutoObservable(this, { compositeScope: false });
    this.compositeScope = context.compositeScope;
  }
}
