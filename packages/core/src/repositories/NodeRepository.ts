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
    return this.nodeIndex.get(`${scopeId}${id}`);
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
    const scopeId = node.scope || ROOT_SCOPE;
    this.nodeTreeMap.setNodeValue(node, scopeId, node.id);
    this.nodeIndex.set(`${scopeId}${node.id}`, node);
  }

  public deleteNode(node: Node) {
    const storedNode = this.nodeIndex.get(`${node.scope}${node.id}`);
    if (storedNode == null) {
      return;
    }
    const scopeId = node.scope || ROOT_SCOPE;
    this.nodeIndex.delete(`${scopeId}${node.id}`);
    this.nodeTreeMap.deleteNode(scopeId, node.id);
    return node;
  }
}
