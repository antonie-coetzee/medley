import {
  generateId,
  Node,
  NodePart,
  ROOT_SCOPE,
  TreeMap,
  Writeable,
} from "../core";

export class NodeRepository<MNode extends Node> {
  public nodeIndex: Map<string, MNode> = new Map();
  public nodeTreeMap: TreeMap<MNode> = new TreeMap();

  public setAllNodes(nodes: MNode[]): void {
    this.nodeTreeMap.clearAllNodes();
    this.nodeIndex.clear();
    nodes.forEach((node) => {
      this.setNode(node);
    });
  }

  public getNode(scopeId: string, id: string) {
    return this.nodeTreeMap.getNodeValue(scopeId, id);
  }

  public getNodes(scopeId: string): MNode[] {
    return this.nodeTreeMap.getFromPath(false, scopeId);
  }

  public getAllNodes(): MNode[] {
    return this.nodeTreeMap.getAllNodes();
  }

  public insertNode(scopeId: string, nodePart: NodePart<MNode>) {
    let newId: string;
    do {
      newId = generateId();
    } while (this.nodeIndex.get(newId));
    let newNode = {
      ...nodePart,
      id: newId,
      scope: scopeId
    } as MNode;

    this.setNode(newNode);
    return newNode;
  }

  public setNode(node: MNode) {
    this.nodeTreeMap.setNodeValue(node, node.scope || ROOT_SCOPE, node.id);
    this.nodeIndex.set(node.id, node);
  }

  public deleteNode(node: Node) {
    const storedNode = this.nodeIndex.get(node.id);
    if (storedNode == null) {
      return;
    }
    this.nodeIndex.delete(node.id);
    this.nodeTreeMap.deleteNode(node.scope || ROOT_SCOPE, node.id);
    return node;
  }
}
