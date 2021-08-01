import { MapFactory, MapType, Node } from "./core";

export class NodeStore {
  public nodeMap: Map<string, Node>;

  constructor(mapFactory?:MapFactory) {
    if(mapFactory){
      this.nodeMap = mapFactory(MapType.Node);
    }else{
      this.nodeMap = new Map();
    }
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
        newId = this.generateId();
      } while (this.nodeMap.has(newId));
      const nodeCpy = { ...node, type: node.type, id: newId };
      this.nodeMap.set(nodeCpy.id, nodeCpy);
      return nodeCpy;
    } else {
      // existing node
      const existingNode = this.nodeMap.get(node.id);
      if (existingNode == null) {
        throw new Error(`node with id: '${node.id}' does not exist`);
      }
      const updatedNode = { ...existingNode, ...node };
      this.nodeMap.set(updatedNode.id, updatedNode);
      return updatedNode;
    }
  }

  public deleteNode(id: string): boolean {
    return this.nodeMap.delete(id);
  }

  public deleteNodesByType(typeName: string) {
    const nodesToDelete = Array.from(this.nodeMap.values()).filter(
      (el) => el.type === typeName
    );
    nodesToDelete.forEach((m) => this.deleteNode(m.id));
    return nodesToDelete?.length > 0 ? true : false;
  }

  /* 
    8,361,453,672 possible combinations
    ~87 days needed, in order to have a 1% probability 
    of at least one collision
   */
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
