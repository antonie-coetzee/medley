import { Node, ROOT_SCOPE, TreeMap } from "../core";

export class NodeRepo {
  public nodeIndex: Map<string,Node> = new Map();
  public nodeTreeMap: TreeMap<Node> = new TreeMap();

  public load(nodes: Node[]): void {
    this.nodeTreeMap.clear();
    this.nodeIndex.clear();
    nodes.forEach((node) => {
      this.nodeIndex.set(node.id, node);
      this.nodeTreeMap.setNodeValue(node, node.scope || ROOT_SCOPE, node.id);
    });
  }

  public getNode(scopeId: string, id: string){
    return this.nodeTreeMap.getNodeValue(scopeId, id);
  };

  public getTypeNameFromNodeId(scopeId: string, id: string) {
    return this.nodeTreeMap.getNodeValue(scopeId, id)?.type;
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
    },new Set<string>())
    return Array.from(usedTypes.keys());
  }

  public getAllUsedTypes(): string[] {
    const nodes = this.nodeTreeMap.getAll();
    const usedTypes = nodes.reduce((acc, node) => {
      acc.add(node.type);
      return acc;
    },new Set<string>())
    return Array.from(usedTypes.keys());
  }

  public upsertNode(scopeId: string, node: Partial<Node>): [boolean, Node] {
    if (node.type == null) {
      throw new Error(`node requires typeName to be defined`);
    }
    if (node.id == null) {    
      // new node
      let newId: string;
      do {
        newId = generateId();
      } while (this.nodeIndex.get(newId));
      const nodeCpy = { ...node, type: node.type, id: newId, scope: scopeId } as Node;
      this.nodeTreeMap.setNodeValue(nodeCpy, scopeId, nodeCpy.id);
      this.nodeIndex.set(nodeCpy.id, nodeCpy);    
      return [true, nodeCpy];
    } else {
      // existing node
      const existingNode = this.nodeTreeMap.getNodeValue(scopeId, node.id);
      if (existingNode == null) {
        throw new Error(`node with id: '${node.id}' does not exist`);
      }
      const updatedNode = { ...existingNode, ...node, scope: scopeId } as Node;
      this.nodeTreeMap.setNodeValue(updatedNode, scopeId, node.id);
      this.nodeIndex.set(node.id, updatedNode);  
      return [false, updatedNode];
    }
  }

  public deleteNode(scopeId: string, id: string) {
    this.nodeIndex.delete(id);
    return this.nodeTreeMap.deleteNode(scopeId, id);
  }
}

const generateId = (length?: number) => {
  const alphanumeric =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const len = length ?? 10;
  var result = "";
  for (var i = 0; i < len; ++i) {
    result += alphanumeric[Math.floor(Math.random() * alphanumeric.length)];
  }
  return result;
};
