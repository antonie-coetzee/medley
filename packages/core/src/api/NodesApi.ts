import { LinksApi } from ".";
import {
  Type,
  Node,
  Link,
  MedleyEvent,
  EventType,
  WithPartial,
  NodePart,
} from "../core";
import { NodeRepo } from "../repos";

export class NodesApi<
  MNode extends Node = Node,
  MType extends Type = Type,
  MLink extends Link = Link
> extends EventTarget {
  constructor(
    private scopeId: string,
    private nodeRepo: NodeRepo,
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

  public insertNode<TNode extends MNode = MNode>(node: NodePart<TNode>) {
    const newNode = { ...node, scope: this.scopeId };
    this.dispatchEvent(MedleyEvent.create(EventType.OnItemCreate, newNode));
    this.dispatchEvent(MedleyEvent.create(EventType.OnChange));
    return this.nodeRepo.insertNode(newNode) as TNode;
  }

  public async copyNode<TNode extends MNode = MNode>(node: TNode) {
    const nodeCopy = JSON.parse(JSON.stringify(node)) as WithPartial<
      TNode,
      "id"
    >;
    delete nodeCopy.id;
    return this.insertNode<TNode>(nodeCopy as NodePart<TNode>);
  }

  public deleteNode<TNode extends MNode = MNode>(node: TNode) {
    const sourceLinks = this.linksApi
      .getAllLinks()
      .filter((l) => l.source === node.id);
    if (sourceLinks && sourceLinks.length > 0) {
      throw new Error(
        `node with id: '${node.id}' is a source and cannot be deleted`
      );
    }
    const deletedNode = this.nodeRepo.removeNode(node);
    if (deletedNode) {
      this.dispatchEvent(
        MedleyEvent.create(EventType.OnItemDelete, deletedNode)
      );
      this.dispatchEvent(MedleyEvent.create(EventType.OnChange));
    }
  }
}
