import { DEFAULT_SCOPE, generateId, Node, NodePart, TreeMap } from "../core";

export class NodeRepository<MNode extends Node> {
  public nodeIndex: Map<string, MNode> = new Map();
  public nodeTreeMap: TreeMap<MNode> = new TreeMap();

  public async setNodes(nodes: MNode[]): Promise<void> {
    this.nodeTreeMap.clearNodes();
    this.nodeIndex.clear();
    for (const node of nodes) {
      this.upsertNode(node.scope || DEFAULT_SCOPE, node);
    }
  }

  public async getNodes(scopeId?: string): Promise<MNode[]> {
    if (scopeId) {
      return this.nodeTreeMap.getFromPath(false, scopeId);
    } else {
      return this.nodeTreeMap.getNodes();
    }
  }

  public async getNode(
    scopeId: string,
    nodeId: string
  ): Promise<MNode | undefined> {
    return this.nodeIndex.get(`${scopeId}${nodeId}`);
  }

  public async insertNodePart<TNode extends MNode>(
    scopeId: string,
    nodePart: NodePart<MNode>
  ): Promise<TNode> {
    let newId: string;
    do {
      newId = generateId();
    } while (this.nodeIndex.get(`${scopeId}${newId}`));
    let newNode = {
      ...nodePart,
      id: newId,
      scope: scopeId,
    } as TNode;

    this.upsertNode(scopeId, newNode);
    return newNode;
  }

  public async upsertNode(scopeId: string, node: MNode): Promise<boolean> {
    const nodeScope = node.scope || DEFAULT_SCOPE;
    if (nodeScope !== scopeId) {
      throw new Error(
        `node: '${node.id}' with scope: '${node.scope}' not equal to '${scopeId}'`
      );
    }
    this.nodeIndex.set(`${nodeScope}${node.id}`, node);
    return this.nodeTreeMap.setNodeValue(node, nodeScope, node.id);
  }

  public async deleteNode(scopeId: string, nodeId: string): Promise<boolean> {
    const storedNode = this.nodeIndex.get(`${scopeId}${nodeId}`);
    if (storedNode == null) {
      return false;
    }
    this.nodeTreeMap.deleteNode(scopeId, nodeId);
    this.nodeIndex.delete(`${scopeId}${nodeId}`);
    return true;
  }
}
