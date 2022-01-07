import { Node, NodePart } from "../core";
import { NodeRepository } from "../repositories";

export class Nodes<MNode extends Node = Node> {
  constructor(
    private scopeId: string,
    private nodeRepository: NodeRepository<MNode>
  ) {}

  public getNode(nodeId: string): MNode | undefined {
    return this.nodeRepository.getNode(this.scopeId, nodeId);
  }

  public getNodes(): MNode[] {
    return this.nodeRepository.getNodes(this.scopeId);
  }

  public upsertNode<TNode extends MNode>(node: TNode): void {
    this.nodeRepository.upsertNode(this.scopeId, node);
  }

  public insertNodePart<TNode extends MNode>(nodePart: NodePart<TNode>): TNode {
    return this.nodeRepository.insertNodePart(this.scopeId, nodePart) as TNode;
  }

  public deleteNode(nodeId: string): boolean {
    const deletedNode = this.nodeRepository.deleteNode(this.scopeId, nodeId);
    return deletedNode ? true : false;
  }
}
