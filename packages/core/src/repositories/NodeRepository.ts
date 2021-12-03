import {
  generateId,
  Node,
  NodePart,
  ROOT_SCOPE,
  TreeMap,
  Writeable,
} from "../core";

export class NodeRepository<MNode extends Node = Node> {
  public nodeIndex: Map<string, MNode> = new Map();
  public nodeTreeMap: TreeMap<MNode> = new TreeMap();

  public set(nodes: MNode[]): void {
    this.nodeTreeMap.clear();
    this.nodeIndex.clear();
    nodes.forEach((node) => {
      this.nodeIndex.set(node.id, node);
      this.nodeTreeMap.setNodeValue(node, node.scope || ROOT_SCOPE, node.id);
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
    return this.nodeTreeMap.getAll();
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
    const nodes = this.nodeTreeMap.getAll();
    const usedTypes = nodes.reduce((acc, node) => {
      acc.add(node.type);
      return acc;
    }, new Set<string>());
    return Array.from(usedTypes.keys());
  }

  public insertNode(node: NodePart<MNode>) {
    let newId: string;
    do {
      newId = generateId();
    } while (this.nodeIndex.get(newId));
    let newNode = {
      ...node,
      id: newId,
      scope: node.scope || ROOT_SCOPE,
    } as MNode;

    this.nodeTreeMap.setNodeValue(newNode, newNode.scope || ROOT_SCOPE, newNode.id);
    this.nodeIndex.set(newNode.id, newNode);
    return newNode;
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
