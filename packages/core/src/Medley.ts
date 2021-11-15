import {
  Node,
  Type,
  Logger,
  nullLogger,
  Link,
  ROOT_SCOPE,
  Loader,
  Unwrap,
} from "./core";
import { TypeRepo, NodeRepo, LinkRepo } from "./repos";
import { Conductor } from "./Conductor";
import { GraphApi, TypesApi, NodesApi, LinksApi } from "./api";
import { InputProvider } from ".";

export interface MedleyOptions<
  MNode extends Node = Node,
  MType extends Type = Type,
  MLink extends Link = Link
> {
  typeRepo: TypeRepo;
  nodeRepo: NodeRepo;
  linkRepo: LinkRepo;
  cache?: Map<string, unknown>;
  logger?: Logger;
  scopeId?: string;
}

export class Medley<
  MNode extends Node = Node,
  MType extends Type = Type,
  MLink extends Link = Link
> {
  private conductor: Conductor<MNode, MType, MLink>;
  private options: MedleyOptions<MNode, MType, MLink>;
  private instanceData: {} = {};

  public logger: Logger;
  public nodes: NodesApi<MNode, MType, MLink>;
  public types: TypesApi<MType>;
  public links: LinksApi<MLink>;
  public graph: GraphApi<MNode, MType, MLink>;
  public scopeId: string;

  public constructor(
    options?: Partial<MedleyOptions<MNode, MType, MLink>>,
    public parentInstance?: Medley<MNode, MType, MLink>
  ) {
    if (options == null) {
      this.options = {
        linkRepo: new LinkRepo(),
        typeRepo: new TypeRepo(new Loader()),
        nodeRepo: new NodeRepo(),
      };
    } else {
      this.options = {
        ...options,
        linkRepo: options.linkRepo || new LinkRepo(),
        typeRepo: options.typeRepo || new TypeRepo(new Loader()),
        nodeRepo: options.nodeRepo || new NodeRepo(),
      };
    }

    this.scopeId = this.options.scopeId || ROOT_SCOPE;
    this.logger = this.options.logger || nullLogger;

    this.types = new TypesApi<MType>(
      this.scopeId,
      this.options.typeRepo,
      parentInstance?.types
    );
    this.links = new LinksApi<MLink>(this.scopeId, this.options.linkRepo);
    this.nodes = new NodesApi<MNode, MType, MLink>(
      this.scopeId,
      this.options.nodeRepo,
      this.links,
      parentInstance?.nodes
    );
    this.graph = new GraphApi<MNode, MType, MLink>(
      this.nodes,
      this.types,
      this.links
    );

    this.conductor = new Conductor<MNode, MType, MLink>(this, this.options.cache);
  }

  public setScopeData(data:{}){
    if(this.parentInstance){
      if(this.instanceData === {}){
        this.instanceData = {...this.parentInstance.instanceData};  
      }
      this.instanceData = {...this.instanceData, ...data};
    }else{
      this.instanceData = {...this.instanceData, ...data};
    }
  }

  public getScopeData<T extends {}>(){
    return this.instanceData as { [Property in keyof T]: T[Property] | undefined};
  }

  public runNode<T>(
    nodeId: string,
    ...args: T extends (...args: any) => any ? Parameters<T> : any[]
  ): Promise<Unwrap<T>> {
    return this.conductor.runNodeFunction(nodeId, null, ...args);
  }

  public runNodeWithInputs<T>(
    nodeId: string,
    inputs: InputProvider<MNode, MType, MLink>,
    ...args:  T extends (...args: any) => any ? Parameters<T> : any[]
  ): Promise<Unwrap<T>>{
    return this.conductor.runNodeFunction(nodeId, inputs, ...args);
  }

  public getRootInstance(): Medley<MNode, MType, MLink> {
    if (this.parentInstance) {
      return this.parentInstance.getRootInstance();
    } else {
      return this;
    }
  }

  public static getChildInstance<
    TNode extends Node = Node,
    TType extends Type = Type,
    TLink extends Link = Link
  >(parent: Medley<TNode, TType, TLink>, scopeId: string) {
    if (scopeId == null || scopeId === "") {
      throw new Error("scopeId not valid");
    }
    const instance = new Medley<TNode, TType, TLink>(
      { ...parent.options, scopeId },
      parent
    );
    return instance;
  }

  public static getScopedInstance<
    TNode extends Node = Node,
    TType extends Type = Type,
    TLink extends Link = Link
  >(
    parent: Medley<TNode, TType, TLink>,
    scopeId: string,
    isChild: boolean = false
  ) {
    if (scopeId == null || scopeId === "") {
      throw new Error("scopeId not valid");
    }
    const instance = new Medley<TNode, TType, TLink>(
      { ...parent.options, scopeId },
      isChild ? parent : undefined
    );
    return instance;
  }
}