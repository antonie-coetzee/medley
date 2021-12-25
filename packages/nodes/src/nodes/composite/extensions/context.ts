import { chainObjects, CLink, CMedleyTypes, CNode, CType } from "@medley-js/common";
import { NodeContext, MedleyTypes, Nodes, Types, Links, Medley, NodePart, AnyLink } from "@medley-js/core";
import { onLinksChange } from "./links";
import { onNodeInsert, onNodesChange } from "./nodes";

const compositeScopeKey = Symbol("compositeScopeKey");

declare module "@medley-js/core" {
  interface NodeContext<TNode extends MT["node"], MT extends MedleyTypes> {
    get compositeScope():Medley<MT>;
  }
}

Object.defineProperty(NodeContext.prototype, "compositeScope", {
  get(this: NodeContext<CNode, CMedleyTypes>){
    if(this.node[compositeScopeKey]){
      return this.node[compositeScopeKey];
    }

    const compositeNodeId = this.node.id;
    const parent = this.medley;

    const scopedNodes = new Nodes<CNode>(compositeNodeId, parent.nodeRepository);
    const scopedTypes = new Types<CType>(compositeNodeId, parent.typeRepository);
    const scopedLinks = new Links<CLink>(compositeNodeId, parent.linkRepository);
  
    const compositeScope = new Medley<CMedleyTypes>({
      scopeId: compositeNodeId,
      nodeRepository: parent.nodeRepository,
      typeRepository: parent.typeRepository,
      linkRepository: parent.linkRepository,
      loader: parent.loader,
      cache: parent.cache,
      conductor: parent.conductor,
      types: chainObjects(scopedTypes, {
        getType: (typeName) => {
          const type = scopedTypes.getType(typeName);
          if (type) {
            return type;
          } else {
            return parent.types.getType(typeName);
          }
        },
        getExport: async (typeName, exportName) => {
          const exportValue = await scopedTypes.getExport(typeName, exportName);
          if (exportValue) {
            return exportValue;
          } else {
            return parent.types.getExport(typeName, exportName);
          }
        },      
      }),
      nodes: chainObjects<Nodes<CNode>>(scopedNodes, {
        insertNode: <TNode extends CNode>(nodePart: NodePart<TNode>) => { 
          let newNode: TNode;    
          if(scopedNodes[onNodeInsert]){
            newNode = scopedNodes.insertNode(scopedNodes[onNodeInsert]!(nodePart))
          }else{
            newNode = scopedNodes.insertNode(nodePart);      
          }
          scopedNodes[onNodesChange]?.call(scopedNodes);
          return newNode;
        },
        deleteNode: (node) => {
          scopedNodes[onNodesChange]?.call(scopedNodes);
          return scopedNodes.deleteNode(node);
        },
        getNode: (id: string) => {
          const node = scopedNodes.getNode(id);
          if (node) {
            return node;
          } else {
            return parent.nodes.getNode(id);
          }
        },
      }),
      links: chainObjects<Links<CLink>>(scopedLinks, {
        addLink: (newLink: AnyLink<CLink>) => {
          scopedLinks[onLinksChange]?.call(scopedLinks);
          return scopedLinks.addLink(newLink);
        },
        deleteLink: (link: CLink) => {
          scopedLinks[onLinksChange]?.call(scopedLinks);
          return scopedLinks.deleteLink(link);
        },
      }),
    });
    this.node[compositeScopeKey] = compositeScope;
    return compositeScope;
  }
});