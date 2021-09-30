import { TypesApi, LinksApi } from ".";
import { Type, Node, Link, ROOT_SCOPE } from "../core";
import { FlowEngine } from "../FlowEngine";
import { NodeRepo } from "../repos";

export class NodesApi<
  TNode extends Node = Node,
  TType extends Type = Type,
  TLink extends Link = Link
> {
  constructor(
    private scopeId: string,
    private nodeRepo: NodeRepo,
    private typesApi: TypesApi<TType>,
    private linksApi: LinksApi<TLink>,
    private parentNodes?: NodesApi<TNode>
  ) {}

  public load(nodes: Node[]) {
    this.nodeRepo.load(nodes);
  }

  public getNode(id: string): TNode | undefined {
    const node = this.nodeRepo.getNode(this.scopeId, id);
    if (node) {
      return node as TNode;
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

  public getNodesByType(typeName: string): TNode[] {
    const scopeNodes = this.nodeRepo.getNodesByType(
      this.scopeId,
      typeName
    ) as TNode[];
    if (this.parentNodes) {
      const parentNodes = this.parentNodes.getNodesByType(typeName);
      return [...parentNodes, ...scopeNodes];
    }
    return scopeNodes;
  }

  public getNodes(): Node[] {
    const scopeNodes = this.nodeRepo.getNodes(this.scopeId) as TNode[];
    if (this.parentNodes) {
      const parentNodes = this.parentNodes.getNodes();
      return [...parentNodes, ...scopeNodes];
    }
    return scopeNodes;
  }

  public getAllNodes(): Node[] {
    return this.nodeRepo.getAllNodes() as TNode[];
  }

  public getUsedTypes(): string[] {
    const scopeTypes = this.nodeRepo.getUsedTypes(this.scopeId);
    if (this.parentNodes) {
      const parentTypes = this.parentNodes.getUsedTypes();
      return [...new Set([...parentTypes, ...scopeTypes])];
    }
    return scopeTypes;
  }

  public upsertNode(node: Partial<Node>, type?: TType): TNode {
    let nodeType: TType;
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
    const outNode = this.nodeRepo.upsertNode(this.scopeId, {
      ...node,
      type: nodeType.name,
    });
    return outNode as TNode;
  }

  public copyNode(node: Node) {
    const nodeCopy = JSON.parse(JSON.stringify(node)) as Partial<Node>;
    delete nodeCopy.id;
    nodeCopy.scope = this.scopeId;
    return this.upsertNode(nodeCopy) as TNode;
  }

  public deleteNode(nodeId: string) {
    const typeName = this.nodeRepo.getTypeNameFromNodeId(this.scopeId, nodeId);
    if (typeName == null) {
      throw new Error(`type name for node with id: '${nodeId}', not found`);
    }

    const sourceLinks = this.linksApi.getAllLinks().filter(l=>l.source===nodeId);
    if (sourceLinks && sourceLinks.length > 0) {
      throw new Error(
        `node with id: '${nodeId}' is a source and cannot be deleted`
      );
    }
    this.nodeRepo.deleteNode(this.scopeId, nodeId);
  }
}
