import { generateId, Node } from "../core";

export class NodeRepo {
  public nodeMap: Map<string, Node> = new Map();

  constructor(onConstruct?: (this: NodeRepo) => void) {
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

  public getNodesByType(typeName: string, parent?: string): Node[] {
    return Array.from(this.nodeMap.values()).filter(
      (el) =>
        el.type === typeName && (parent != null ? el.parent === parent : true)
    );
  }

  public getNodes(parent?: string): Node[] {
    if (parent) {
      return Array.from(this.nodeMap.values()).filter(
        (n) => n.parent === parent
      );
    } else {
      return Array.from(this.nodeMap.values());
    }
  }

  public getUsedTypes(parent?: string): string[] {
    const usedTypes = Array.from(this.nodeMap.values()).reduce((pv, cv) => {
      pv.add(cv.type);
      return pv;
    }, new Set<string>());
    return Array.from(usedTypes.keys());
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
