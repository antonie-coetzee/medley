import { TypesApi, LinksApi } from ".";
import { Type, Node, Link, MedleyEvent, EventType } from "../core";
import { NodeRepo } from "../repos";

export class NodesApi<
  MNode extends Node = Node,
  MType extends Type = Type,
  MLink extends Link = Link
  > extends EventTarget {

  constructor(
    private scopeId: string,
    private nodeRepo: NodeRepo,
    private typesApi: TypesApi<MType>,
    private linksApi: LinksApi<MLink>,
    private parentNodes?: NodesApi<MNode, MType, MLink>
  ) {
    super();
  }

  public setNodes(nodes: Node[]) {
    this.nodeRepo.set(nodes);
    this.dispatchEvent(new MedleyEvent(EventType.OnChange));
  }

  public getNode(id: string): MNode | undefined {
    const node = this.nodeRepo.getNode(this.scopeId, id);
    if (node) {
      return node as MNode;
    }
    if (this.parentNodes) {
      return this.parentNodes.getNode(id);
    }
  }

  public getTypeNameFromNodeId(id: string): string | undefined {
    const typeName = this.nodeRepo.getTypeNameFromNodeId(this.scopeId, id);
    if (typeName) {
      return typeName;
    }
    if (this.parentNodes) {
      return this.parentNodes.getTypeNameFromNodeId(id);
    }
  }

  public getNodesByType(typeName: string): MNode[] {
    const scopeNodes = this.nodeRepo.getNodesByType(
      this.scopeId,
      typeName
    ) as MNode[];
    if (this.parentNodes) {
      const parentNodes = this.parentNodes.getNodesByType(typeName);
      return [...parentNodes, ...scopeNodes];
    }
    return scopeNodes;
  }

  public getNodes(): MNode[] {
    const scopeNodes = this.nodeRepo.getNodes(this.scopeId) as MNode[];
    return scopeNodes;
  }

  public getAllNodes(): MNode[] {
    return this.nodeRepo.getAllNodes() as MNode[];
  }

  public getUsedTypes(): string[] {
    const scopeTypes = this.nodeRepo.getUsedTypes(this.scopeId);
    return scopeTypes;
  }

  public getScopedUsedTypes(): string[] {
    const scopeTypes = this.nodeRepo.getUsedTypes(this.scopeId);
    return scopeTypes;
  }

  public upsertNode(node: Partial<MNode>, type?: MType): MNode {
    let nodeType: MType;
    if (type) {
      const hasType = this.typesApi.hasType(type.name);
      if (hasType === false) {
        this.typesApi.addType(type);
      }
      nodeType = type;
    } else if (node.type) {
      const type = this.typesApi.getType(node.type);
      if (type == null) {
        throw new Error(`type with name: '${node.type}' not found`);
      }
      nodeType = type;
    } else {
      throw new Error("either type or node.type must be provided");
    }
    const [added, outNode] = this.nodeRepo.upsertNode(this.scopeId, {
      ...node,
      type: nodeType.name,
    });
    if (added) {
      this.dispatchEvent(MedleyEvent.create(EventType.OnItemAdd, outNode));
      this.dispatchEvent(MedleyEvent.create(EventType.OnChange));
    }else{
      this.dispatchEvent(MedleyEvent.create(EventType.OnItemUpdate, outNode));
    }
    return outNode as MNode;
  }

  public copyNode(node: MNode) {
    const nodeCopy = JSON.parse(JSON.stringify(node)) as Partial<MNode>;
    delete nodeCopy.id;
    nodeCopy.scope = this.scopeId;
    return this.upsertNode(nodeCopy) as MNode;
  }

  public deleteNode(nodeId: string) {
    const typeName = this.nodeRepo.getTypeNameFromNodeId(this.scopeId, nodeId);
    if (typeName == null) {
      throw new Error(`type name for node with id: '${nodeId}', not found`);
    }

    const sourceLinks = this.linksApi
      .getAllLinks()
      .filter((l) => l.source === nodeId);
    if (sourceLinks && sourceLinks.length > 0) {
      throw new Error(
        `node with id: '${nodeId}' is a source and cannot be deleted`
      );
    }
    const node = this.nodeRepo.getNode(this.scopeId, nodeId);
    const wasDeleted = this.nodeRepo.deleteNode(this.scopeId, nodeId);
    if (node && wasDeleted) {
      this.dispatchEvent(MedleyEvent.create(EventType.OnItemDelete, node));
      this.dispatchEvent(MedleyEvent.create(EventType.OnChange));
    }
  }
}
