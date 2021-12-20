import { makeAutoObservable } from "mobx";
import { InputNode } from "../scopedTypes/input/InputNode";
import { OutputNode } from "../scopedTypes/output/node";

export class NodeStore {
  public inputNodes: InputNode[] = [];
  public outputNode: OutputNode | undefined;

  private constructor() {
    makeAutoObservable(this);
  }

  static Provider():NodeStore{
    return new NodeStore();
  }
}