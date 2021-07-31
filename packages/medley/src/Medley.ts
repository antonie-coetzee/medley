import {
  Loader,
  Node,
  LoaderOptions,
  Type,
  Composition,
  TypedNode,
  Logger,
  nullLogger,
} from "./core";
import { TypeRepository } from "./TypeRepository";
import { NodeRepository } from "./NodeRepository";
import { FlowEngine } from "./FlowEngine";
import { LinkRepository } from "./LinkRepository";
import { ReturnedPromiseType } from "./Context";

export interface MedleyOptions {
  loader: LoaderOptions;
  logger?: Logger;
  eventHooks?: {
    typesUpdate?: (types: Type[]) => void;
    nodesOfTypeUpdate?: (type: Type, nodes: TypedNode[]) => void;
    nodeUpdate?: (type: Type, node: TypedNode) => void;
  };
}

export class Medley { 
  private composition?: Composition;
  private nodeRepository: NodeRepository;
  private typeRepository: TypeRepository;
  private linkRepository: LinkRepository;
  private flowEngine: FlowEngine;
  private baseLogger: Logger;

  public constructor(private options: MedleyOptions) {
    const loader = new Loader(options.loader);
    this.typeRepository = new TypeRepository(loader);
    this.nodeRepository = new NodeRepository();
    this.linkRepository = new LinkRepository();
    this.flowEngine = new FlowEngine(this);
    this.baseLogger = options.logger || nullLogger;
  }

  public new = () => {
    return new Medley(this.options);
  };

  public updateOptions = (options: Partial<MedleyOptions>) => {
    this.options = this.mergeDeep(this.options, options);
  };

  public import = (composition: Composition, baseUrl: URL) => {
    this.composition = composition;
    this.typeRepository.load(composition.parts, baseUrl);
    const loadedTypes = this.typeRepository.getTypes();
    this.options?.eventHooks?.typesUpdate?.call(null, loadedTypes);
    this.nodeRepository.load(composition.parts);
    this.linkRepository.load(composition.links);
    if (this.options?.eventHooks?.nodesOfTypeUpdate) {
      const nodesOfTypeUpdate = this.options.eventHooks.nodesOfTypeUpdate;
      loadedTypes.forEach((type) => {
        nodesOfTypeUpdate(
          type,
          this.nodeRepository.getNodesByType(type.name)
        );
      });
    }
  };

  public runNodeFunction = async <T extends (...args: any) => any>(
    nodeId: string,
    ...args: Parameters<T>
  ): Promise<ReturnedPromiseType<T>> => {
    this.checkComposition();
    return this.flowEngine.runNodeFunction(nodeId, ...args);
  };

  public getComposition = () => {
    return this.composition;
  }

  public updateComposition = (updator:<T extends Composition>(composition:T)=>T) => {
    this.checkComposition();
    if(this.composition && updator){
      this.composition = updator(this.composition);
    }
  }

  public getTypedNode = (nodeId: string) => {
    this.checkComposition();
    return this.nodeRepository.getNode(nodeId);
  };

  public upsertTypedNode = (typedNode: Partial<TypedNode>) => {
    this.checkComposition();
    if (typedNode.typeName == null) {
      throw new Error("typedNode requires typeName to be defined");
    }
    const type = this.typeRepository.getType(typedNode.typeName);
    return this.upsertNode(type, typedNode);
  };

  public upsertNode = (type: Type, node: Partial<Node>) => {
    this.checkComposition();
    const hasType = this.typeRepository.hasType(type.name);
    if (hasType === false) {
      this.typeRepository.addType(type);
      this.options?.eventHooks?.typesUpdate?.call(
        null,
        this.typeRepository.getTypes()
      );
    }
    const { isNew, node: typedNode } = this.nodeRepository.upsertNode({
      ...node,
      typeName: type.name,
    });
    if (isNew) {
      this.options?.eventHooks?.nodesOfTypeUpdate?.call(
        null,
        type,
        this.nodeRepository.getNodesByType(type.name)
      );
    }
    this.options?.eventHooks?.nodeUpdate?.call(null, type, typedNode);
    return typedNode;
  };

  public getNodesByType = (typeName: string) => {
    this.checkComposition();
    return this.nodeRepository.getNodesByType(typeName);
  };

  public deleteNodeById = (nodeId: string) => {
    this.checkComposition();
    const typeName = this.nodeRepository.getTypeNameFromNodeId(nodeId);
    if(typeName == null){
      throw new Error(`type name for node with id: '${nodeId}', not found`);
    }
    const type = this.typeRepository.getType(typeName);
    const deleted = this.nodeRepository.deleteNode(nodeId);
    
    if(deleted){
      this.options?.eventHooks?.nodesOfTypeUpdate?.call(
        null,
        type,
        this.nodeRepository.getNodesByType(type.name)
      );
      const nodes = this.nodeRepository.getNodesByType(typeName);
      // delete type if not referenced
      if (nodes?.length == null || nodes?.length === 0) {
        this.typeRepository.deleteType(typeName);
        this.options?.eventHooks?.typesUpdate?.call(
          null,
          this.typeRepository.getTypes()
        );
      }
    }
  };

  public getType = (typeName: string) => {
    this.checkComposition();
    return this.typeRepository.getType(typeName);
  };

  public getTypes = () => {
    this.checkComposition();
    return this.typeRepository.getTypes();
  };

  public getNodeFunctionFromType = async (typeName: string) => {
    this.checkComposition();
    return this.typeRepository.getNodeFunction(typeName);
  };

  public getExportFromType = async <T>(
    typeName: string,
    exportName: string
  ) => {
    this.checkComposition();
    return this.typeRepository.getExport(typeName, exportName) as Promise<T>;
  };

  public deleteType = (typeName: string) => {
    this.checkComposition();
    if (this.nodeRepository.deleteNodesByType(typeName)) {
      this.options?.eventHooks?.nodesOfTypeUpdate?.call(
        null,
        this.typeRepository.getType(typeName),
        []
      );
    }
    if (this.typeRepository.deleteType(typeName)) {
      this.options?.eventHooks?.typesUpdate?.call(
        null,
        this.typeRepository.getTypes()
      );
    }
  };

  public export = <T extends Composition = Composition>() => {
    this.checkComposition();
    const types = this.typeRepository.getTypes();
    const links = this.linkRepository.getLinks();
    const nodesWithType = types.map((type) => {
      return {
        type: type,
        nodes: this.nodeRepository
          .getNodesByType(type.name)
          // remove redundant typeName
          .map((tm) => ({ ...tm, typeName: undefined })),
      };
    });
    if (this.composition) {
      const currentState = {
        ...(this.composition as T),
        parts: nodesWithType,
        links: links,
      };
      // return clone to avoid externally introduced side-effects
      return JSON.parse(JSON.stringify(currentState)) as T
    }
  };

  public addLink(source: string, target: string, port: string){
    this.linkRepository.addLink(source, target, port)
  }

  public getPortLinks(nodeId: string, portName: string){
    return this.linkRepository.getPortLinks(nodeId, portName);
  }

  public getPortInstanceLinks(nodeId: string, portName: string){
    return this.linkRepository.getPortInstanceLinks(nodeId, portName);
  }

  public getPortsFromType(typeName:string){
    return this.typeRepository.getPortsFromType(typeName);
  }

  public getLogger = () => {
    return this.baseLogger;
  }

  private checkComposition(){
    if(this.composition == null){
      throw new Error("composition not present");
    }
  }

  private mergeDeep(...objects: any[]) {
    if(objects == null){
      return;
    }
    
    const isObject = (obj: any) => obj && typeof obj === "object";

    return objects.reduce((prev, obj) => {
      Object.keys(obj).forEach((key) => {
        const pVal = prev[key];
        const oVal = obj[key];

        if (Array.isArray(pVal) && Array.isArray(oVal)) {
          prev[key] = pVal.concat(...oVal);
        } else if (isObject(pVal) && isObject(oVal)) {
          prev[key] = this.mergeDeep(pVal, oVal);
        } else {
          prev[key] = oVal;
        }
      });

      return prev;
    }, {});
  }
}
