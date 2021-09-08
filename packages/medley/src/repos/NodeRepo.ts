import { generateId, Node } from "../core";

export class NodeRepo {
  public nodeMap: Map<string, Node> = new Map();

  constructor(onConstruct?:(this:NodeRepo)=>void) {
    onConstruct?.call(this);
  }

  public load(nodes: Node[]): void {
    this.nodeMap.clear();
    nodes.forEach((node) => {
      this.nodeMap.set(node.id, node);
    });
  }

  public getNode = (id: string): Node => {
    const node = this.nodeMap.get(id);
    if (node == null) throw new Error(`node with id: ${id}, not found`);
    return node;
  };

  public getTypeNameFromNodeId(id: string) {
    const node = this.nodeMap.get(id);
    return node?.type;
  }

  public getNodesByType(typeName: string): Node[] {
    return Array.from(this.nodeMap.values()).filter(
      (el) => el.type === typeName
    );
  }

  public getNodes(): Node[] {
    return Array.from(this.nodeMap.values());
  }

  public getUsedTypes(): string[] {
    const typeMap = new Map();
    this.nodeMap.forEach((el) => typeMap.set(el.type, el.type));
    return Array.from(typeMap.keys());
  }

  public upsertNode(node: Partial<Node>) {
    if (node.type == null) {
      throw new Error(`node requires typeName to be defined`);
    }
    if (node.id == null) {
      // new node
      let newId: string;
      do {
        newId = generateId();
      } while (this.nodeMap.has(newId));
      const nodeCpy = { ...node, type: node.type, id: newId } as Node;
      this.nodeMap.set(nodeCpy.id, nodeCpy);
      return nodeCpy;
    } else {
      // existing node
      const existingNode = this.nodeMap.get(node.id);
      if (existingNode == null) {
        throw new Error(`node with id: '${node.id}' does not exist`);
      }
      const updatedNode = { ...existingNode, ...node } as Node;
      this.nodeMap.set(updatedNode.id, updatedNode);
      return updatedNode;
    }
  }

  public deleteNode(id: string): boolean {
    return this.nodeMap.delete(id);
  }
}
