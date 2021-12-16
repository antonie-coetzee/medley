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

  public set(nodes: MNode[]): void {
    this.nodeTreeMap.clearAllNodes();
    this.nodeIndex.clear();
    nodes.forEach((node) => {
      this.setNode(node);
    });
  }

  public getNode(scopeId: string, id: string) {
    return this.nodeTreeMap.getNodeValue(scopeId, id);
  }

  public getNodesByType(scopeId: string, typeName: string): MNode[] {
    return this.nodeTreeMap
      .getFromPath(false, scopeId)
      .filter((n) => n.type === typeName);
  }

  public getNodes(scopeId: string): MNode[] {
    return this.nodeTreeMap.getFromPath(false, scopeId);
  }

  public getAllNodes(): MNode[] {
    return this.nodeTreeMap.getAllNodes();
  }

  public getUsedTypes(scopeId: string): string[] {
    const nodes = this.nodeTreeMap.getFromPath(false, scopeId);
    const usedTypes = nodes.reduce((acc, node) => {
      acc.add(node.type);
      return acc;
    }, new Set<string>());
    return Array.from(usedTypes.keys());
  }

  public getAllUsedTypes(): string[] {
    const nodes = this.nodeTreeMap.getAllNodes();
    const usedTypes = nodes.reduce((acc, node) => {
      acc.add(node.type);
      return acc;
    }, new Set<string>());
    return Array.from(usedTypes.keys());
  }

  public insertNode(nodePart: NodePart<MNode>) {
    let newId: string;
    do {
      newId = generateId();
    } while (this.nodeIndex.get(newId));
    let newNode = {
      ...nodePart,
      id: newId,
      scope: nodePart.scope || ROOT_SCOPE,
    } as MNode;

    this.setNode(newNode);
    return newNode;
  }

  public setNode(node: MNode) {
    this.nodeTreeMap.setNodeValue(node, node.scope || ROOT_SCOPE, node.id);
    this.nodeIndex.set(node.id, node);
  }

  public removeNode(node: Node) {
    const storedNode = this.nodeIndex.get(node.id);
    if (storedNode == null) {
      return;
    }
    this.nodeIndex.delete(node.id);
    this.nodeTreeMap.deleteNode(node.scope || ROOT_SCOPE, node.id);
    return node;
  }
}
