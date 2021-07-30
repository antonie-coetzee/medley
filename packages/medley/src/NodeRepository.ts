import { Node, Part, Type, TypedNode } from "./core";

export class NodeRepository {
  public typedNodeIndex: Map<string, TypedNode> = new Map();

  constructor() {}

  public load(parts: Part[]): void {
    this.typedNodeIndex.clear();
    parts.forEach((part) => {
      const nodes = part.nodes;
      nodes.forEach((node) => {
        const typedNode = { ...node, typeName: part.type.name };
        this.typedNodeIndex.set(node.id, typedNode);
      });
    });
  }

  public getNode = (id: string): TypedNode => {
    const node = this.typedNodeIndex.get(id);
    if (node == null) throw new Error(`node with id: ${id}, not found`);
    return node;
  };

  public getTypeNameFromNodeId(id: string) {
    const node = this.typedNodeIndex.get(id);
    return node?.typeName;
  }

  public getNodesByType(typeName: string): TypedNode[] {
    return Array.from(this.typedNodeIndex.values()).filter(
      (el) => el.typeName === typeName
    );
  }

  public getNodes(): TypedNode[] {
    return Array.from(this.typedNodeIndex.values());
  }

  public getUsedTypes(): string[] {
    const typeMap = new Map();
    this.typedNodeIndex.forEach((el) => typeMap.set(el.typeName, el.typeName));
    return Array.from(typeMap.keys());
  }

  public upsertNode(node: Partial<TypedNode>) {
    if (node.typeName == null) {
      throw new Error(`node requires typeName to be defined`);
    }
    if (node.id == null) {
      // new node
      let newId: string;
      do {
        newId = this.generateId();
      } while (this.typedNodeIndex.has(newId));
      const nodeCpy = { ...node, typeName: node.typeName, id: newId };
      this.typedNodeIndex.set(nodeCpy.id, nodeCpy);
      return { isNew: true, node: nodeCpy };
    } else {
      // existing node
      const existingNode = this.typedNodeIndex.get(node.id);
      if (existingNode == null) {
        throw new Error(`node with id: '${node.id}' does not exist`);
      }
      const updatedNode = { ...existingNode, ...node };
      this.typedNodeIndex.set(updatedNode.id, updatedNode);
      return { isNew: false, node: updatedNode };
    }
  }

  public deleteNode(id: string): boolean {
    return this.typedNodeIndex.delete(id);
  }

  public deleteNodesByType(typeName: string) {
    const nodesToDelete = Array.from(this.typedNodeIndex.values()).filter(
      (el) => el.typeName === typeName
    );
    nodesToDelete.forEach(m=>this.deleteNode(m.id));
    return nodesToDelete?.length > 0 ? true : false;
  }

  // 8,361,453,672 possible combinations, at a 1000 IDs per hour/second, ~87 days needed, in order to have a 1% probability of at least one collision
  private generateId() {
    const alphanumeric =
      "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const length = 8;
    var result = "";
    for (var i = 0; i < length; ++i) {
      result += alphanumeric[Math.floor(Math.random() * alphanumeric.length)];
    }
    return result;
  }
}
