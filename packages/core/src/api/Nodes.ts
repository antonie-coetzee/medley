import { Links } from ".";
import {
  Type,
  Node,
  Link,
  MedleyEvent,
  EventType,
  WithPartial,
  NodePart,
  Writeable,
} from "../core";
import { NodeRepository } from "../repositories";

export class Nodes<
  MNode extends Node = Node,
  MType extends Type = Type,
  MLink extends Link = Link
> {
  public parent?: Nodes<MNode, MType, MLink>

  constructor(
    private scopeId: string,
    private nodeRepo: NodeRepository,
    private linksApi: Links<MLink>,
  ) {}

  public setNodes(nodes: Node[]) {
    this.nodeRepo.set(nodes);
  }

  public getNode(id: string): MNode | undefined {
    const node = this.nodeRepo.getNode(this.scopeId, id);
    if (node) {
      return node as MNode;
    }
    if (this.parent) {
      return this.parent.getNode(id);
    }
  }

  public getNodesByType<TNode extends MNode = MNode>(
    typeName: string
  ): TNode[] {
    const scopeNodes = this.nodeRepo.getNodesByType(
      this.scopeId,
      typeName
    ) as TNode[];
    if (this.parent) {
      const parentNodes = this.parent.getNodesByType<TNode>(typeName);
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

  public insertNode<
    TNode extends MNode = never,
    InferredTNode extends TNode = TNode
  >(node: NodePart<InferredTNode>) {
    node.scope = this.scopeId;
    return this.nodeRepo.insertNode(node) as TNode;
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
    return deletedNode ? true : false;
  }
}
