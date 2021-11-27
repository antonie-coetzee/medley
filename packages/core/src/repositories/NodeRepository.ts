import {
  generateId,
  Node,
  NodePart,
  ROOT_SCOPE,
  TreeMap,
  Writeable,
} from "../core";

export class NodeRepository {
  public nodeIndex: Map<string, Node> = new Map();
  public nodeTreeMap: TreeMap<Node> = new TreeMap();

  public set(nodes: Node[]): void {
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

  public getNodesByType(scopeId: string, typeName: string): Node[] {
    return this.nodeTreeMap
      .getFromPath(false, scopeId)
      .filter((n) => n.type === typeName);
  }

  public getNodes(scopeId: string): Node[] {
    return this.nodeTreeMap.getFromPath(false, scopeId);
  }

  public getAllNodes(): Node[] {
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

  public insertNode(node: NodePart) {
    let newNode = node as Writeable<Node, "id">;
    let newId: string;
    do {
      newId = generateId();
    } while (this.nodeIndex.get(newId));  
    newNode.id = newId
    this.nodeTreeMap.setNodeValue(
      newNode,
      newNode.scope || ROOT_SCOPE,
      newNode.id
    );
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
