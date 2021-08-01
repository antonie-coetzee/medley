import { Medley, Node } from "medley";
import { computed, makeAutoObservable } from "mobx";

export class NodeStore {
  constructor(private medley: Medley, public nodeMap: Map<string, Node>) {
    makeAutoObservable(this);
  }

  public getNodesByType(typeName: string): Node[] {
    return this.medley.getNodesByType(typeName);
  }

  public getNodeById(nodeId: string): Node {
    return this.medley.getNode(nodeId);
  }

  public upsertNode(model: Partial<Node>) {
    return this.medley.upsertTypedNode(model);
  }

  public deleteNodes(nodeIds: string[]) {}

  public copyNode(newName: string, model: Node) {
    const modelCopy = JSON.parse(JSON.stringify(model)) as Partial<Node>;
    modelCopy.name = newName;
    delete modelCopy.id;
    this.medley.upsertTypedNode(modelCopy);
  }
}
