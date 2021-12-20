import { Node, NodePart } from "../core";
import { NodeRepository } from "../repositories";

export class Nodes<MNode extends Node = Node> {
  constructor(
    private scopeId: string,
    private nodeRepository: NodeRepository<MNode>
  ) {}

  public getNode(id: string): MNode | undefined {
    return this.nodeRepository.getNode(this.scopeId, id) as MNode;
  }

  public getNodes(): MNode[] {
    return this.nodeRepository.getNodes(this.scopeId) as MNode[];
  }

  public setNode<TNode extends MNode>(node:TNode){
    node.scope = this.scopeId;
    this.nodeRepository.setNode(node);
  }

  public insertNode<
    TNode extends MNode
  >(nodePart: NodePart<TNode>) {
    nodePart.scope = this.scopeId;
    return this.nodeRepository.insertNode(nodePart) as TNode;
  }

  public deleteNode<TNode extends MNode>(node: TNode) {
    const deletedNode = this.nodeRepository.removeNode(node);
    return deletedNode ? true : false;
  }
}
