import { Node, NodePart } from "../core";
import { NodeRepository } from "../repositories";

export class Nodes<MNode extends Node = Node> {
  constructor(
    private scopeId: string,
    private nodeRepository: NodeRepository<MNode>
  ) {}

  public async getNode(nodeId: string): Promise<MNode | undefined> {
    return this.nodeRepository.getNode(this.scopeId, nodeId);
  }

  public async getNodes(): Promise<MNode[]> {
    return this.nodeRepository.getNodes(this.scopeId);
  }

  public async upsertNode<TNode extends MNode>(node: TNode): Promise<void> {
    this.nodeRepository.upsertNode(this.scopeId, node);
  }

  public async insertNodePart<TNode extends MNode>(nodePart: NodePart<TNode>): Promise<TNode> {
    return this.nodeRepository.insertNodePart(this.scopeId, nodePart);
  }

  public async deleteNode(nodeId: string): Promise<boolean> {
    return this.nodeRepository.deleteNode(this.scopeId, nodeId);
  }
}
