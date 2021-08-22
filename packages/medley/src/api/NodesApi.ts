import { Type, Node } from "../core";
import { FlowEngine } from "../FlowEngine";
import { TypeRepo, NodeRepo, LinkRepo } from "../repos";

export class NodesApi<TNode extends Node = Node>
  implements Omit<NodeRepo, "deleteNode" | "deleteNodesByType" | "upsertNode">
{
  public nodeMap: Map<string, Node<undefined>>;

  constructor(
    private flowEngine: FlowEngine,
    private nodeRepo: NodeRepo,
    private typeRepo: TypeRepo,
    private linkRepo: LinkRepo
  ) {
    this.nodeMap = nodeRepo.nodeMap;
  }

  public load(nodes: Node[]): void {
    return this.nodeRepo.load(nodes);
  }
  public getNode(id: string) {
    return this.nodeRepo.getNode(id) as TNode;
  }

  public getTypeNameFromNodeId(id: string): string | undefined {
    return this.nodeRepo.getTypeNameFromNodeId(id);
  }

  public getNodesByType(typeName: string): Node[] {
    return this.nodeRepo.getNodesByType(typeName) as TNode[];
  }

  public getNodes(): Node[] {
    return this.nodeRepo.getNodes() as TNode[];
  }

  public getUsedTypes(): string[] {
    return this.nodeRepo.getUsedTypes();
  }

  public runNode = async <T>(
    context: {} | null,
    nodeId: string,
    ...args: any[]
  ): Promise<T> => {
    return this.flowEngine.runNodeFunction(context, nodeId, ...args);
  };

  public upsertNode = (node: Partial<Node>, type?: Type): TNode => {
    let nodeType: Type;
    if (type) {
      nodeType = type;
    } else if (node.type) {
      nodeType = this.typeRepo.getType(node.type);
    } else {
      throw new Error("either type or node.type must be provided");
    }

    const hasType = this.typeRepo.hasType(nodeType.name);
    if (hasType === false) {
      this.typeRepo.addType(nodeType);
    }
    const outNode = this.nodeRepo.upsertNode({
      ...node,
      type: nodeType.name,
    });
    return outNode as TNode;
  };

  public copyNode = (node: Node) => {
    const nodeCopy = JSON.parse(JSON.stringify(node)) as Partial<Node>;
    delete nodeCopy.id;
    return this.upsertNode(nodeCopy) as TNode;
  };

  public deleteNode = (nodeId: string) => {
    const typeName = this.nodeRepo.getTypeNameFromNodeId(nodeId);
    if (typeName == null) {
      throw new Error(`type name for node with id: '${nodeId}', not found`);
    }

    const sourceLinks = this.linkRepo.getSourceLinks(nodeId);
    if (sourceLinks && sourceLinks.length > 0) {
      throw new Error(
        `node with id: '${nodeId}' is linked and cannot be deleted`
      );
    }
    const deleted = this.nodeRepo.deleteNode(nodeId);
  };
}
