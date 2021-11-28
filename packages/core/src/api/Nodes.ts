import { Node, NodePart } from "../core";
import { NodeRepository } from "../repositories";

export class Nodes<MNode extends Node = Node> {
  constructor(
    private scopeId: string,
    private nodeRepository: NodeRepository
  ) {}

  public setNodes(nodes: Node[]) {
    this.nodeRepository.set(nodes);
  }

  public getNode(id: string): MNode | undefined {
    return this.nodeRepository.getNode(this.scopeId, id) as MNode;
  }

  public getNodesByType<TNode extends MNode = MNode>(
    typeName: string
  ): TNode[] {
    return this.nodeRepository.getNodesByType(
      this.scopeId,
      typeName
    ) as TNode[];
  }

  public getNodes(): MNode[] {
    return this.nodeRepository.getNodes(this.scopeId) as MNode[];
  }

  public getAllNodes(): MNode[] {
    return this.nodeRepository.getAllNodes() as MNode[];
  }

  public getUsedTypes(): string[] {
    const scopeTypes = this.nodeRepository.getUsedTypes(this.scopeId);
    return scopeTypes;
  }

  public insertNode<
    TNode extends MNode = never,
    InferredTNode extends TNode = TNode
  >(node: NodePart<InferredTNode>) {
    node.scope = this.scopeId;
    return this.nodeRepository.insertNode(node) as TNode;
  }

  public deleteNode<TNode extends MNode = MNode>(node: TNode) {
    const deletedNode = this.nodeRepository.removeNode(node);
    return deletedNode ? true : false;
  }
}
