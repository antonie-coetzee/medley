import {
  DEFAULT_SCOPE, generateId,
  Node,
  NodePart, TreeMap
} from "../core";

export class NodeRepository<MNode extends Node> {
  public nodeIndex: Map<string, MNode> = new Map();
  public nodeTreeMap: TreeMap<MNode> = new TreeMap();

  public setNodes(nodes: MNode[]): void {
    this.nodeTreeMap.clearNodes();
    this.nodeIndex.clear();
    for (const type of nodes) {
      this.upsertNode(type.scope || DEFAULT_SCOPE, type);
    }
  }

  public getNodes(scopeId?: string): MNode[] {
    if(scopeId){
      return this.nodeTreeMap.getFromPath(false, scopeId);
    }else{
      return this.nodeTreeMap.getNodes();
    }
  }

  public getNode(scopeId: string, nodeId: string): MNode | undefined {
    return this.nodeIndex.get(`${scopeId}${nodeId}`);
  }

  public insertNodePart(scopeId: string, nodePart: NodePart<MNode>): MNode {
    let newId: string;
    do {
      newId = generateId();
    } while (this.nodeIndex.get(`${scopeId}${newId}`));
    let newNode = {
      ...nodePart,
      id: newId,
      scope: scopeId,
    } as MNode;

    this.upsertNode(scopeId, newNode);
    return newNode;
  }

  public upsertNode(scopeId: string, node: MNode): boolean {
    const nodeScope = node.scope || DEFAULT_SCOPE;
    if (nodeScope !== scopeId) {
      throw new Error(
        `node: '${node.id}' with scope: '${node.scope}' not equal to '${scopeId}'`
      );
    }
    this.nodeIndex.set(`${nodeScope}${node.id}`, node);
    return this.nodeTreeMap.setNodeValue(node, nodeScope, node.id);
  }

  public deleteNode(scopeId: string, nodeId: string): boolean {
    const storedNode = this.nodeIndex.get(`${scopeId}${nodeId}`);
    if (storedNode == null) {
      return false;
    }
    this.nodeTreeMap.deleteNode(scopeId, nodeId);
    this.nodeIndex.delete(`${scopeId}${nodeId}`);
    return true;
  }
}
