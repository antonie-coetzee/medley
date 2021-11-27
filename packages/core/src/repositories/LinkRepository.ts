import {
  Link,
  ROOT_SCOPE,
  TreeMap,
  PortLink,
} from "../core";

export class LinkRepository {
  private updateSourceToPortMap: boolean = false;

  /* scope -> port -> target -> source -> link */
  private portToSourceMap: TreeMap<PortLink<Link>>;
  /* scope -> source -> target -> port -> link */
  private sourceToPortMap: TreeMap<PortLink<Link>>;
  /* scope -> target -> source */
  private targetToSourceMap: TreeMap<Link>;

  constructor() {
    this.portToSourceMap = new TreeMap();
    this.sourceToPortMap = new TreeMap();
    this.targetToSourceMap = new TreeMap();
  }

  public set(links: Link[]) {
    this.portToSourceMap.clear();
    this.sourceToPortMap.clear();
    this.targetToSourceMap.clear();
    for (const link of links) {
      if (link.port) {
        this.addToPortToSourceMap(link as PortLink);
      } else {
        this.addToTargetToSourceMap(link);
      }
    }
    this.updateSourceToPortMap = true;
  }

  public getLink(scopeId: string, target: string, source: string, port?:string) {
    if(port){
      const links = this.portToSourceMap.getFromPath(
        false,
        scopeId,
        port,
        target,
        source
      );
      if (links.length > 0) {
        return links[0];
      }
    }else{
      const links = this.targetToSourceMap.getFromPath(
        false,
        scopeId,
        target,
        source
      );
      if (links.length > 0) {
        return links[0];
      }
    }
  }

  public addLink(link: Link) {
    if(link.port){
      this.updateSourceToPortMap = true;
      return this.addToPortToSourceMap(link as PortLink);
    }else{
      return this.addToTargetToSourceMap(link);
    }
  }

  public getPortLinks(scopeId: string, port: string, target: string) {
    return this.portToSourceMap.getFromPath(false, scopeId, port, target);
  }

  public getSourceToPortLinks(scopeId: string, source: string) {
    if (this.updateSourceToPortMap) {
      this.sourceToPortMap.clear();
      const allLinks = this.portToSourceMap.getAll();
      for (const link of allLinks) {
        this.addToSourceToPortMap(link);
      }
    }
    return this.sourceToPortMap.getFromPath(true, scopeId, source);
  }

  public getSourceLinks(scopeId: string, target: string) {
    return this.targetToSourceMap.getFromPath(true, scopeId, target);
  }

  public getLinks(scopeId: string) {
    return [
      ...this.portToSourceMap.getFromPath(true, scopeId),
      ...this.targetToSourceMap.getFromPath(true, scopeId),
    ];
  }

  public getAllLinks(){
    return [
      ...this.portToSourceMap.getAll(),
      ...this.targetToSourceMap.getAll(),
    ];
  }

  public deleteLink(link: Link) {
    if(link.port){
      this.updateSourceToPortMap = true;
      return this.portToSourceMap.deleteNode(
        link.scope || ROOT_SCOPE,
        link.port,
        link.target,
        link.source
      );
    }else{
      return this.targetToSourceMap.deleteNode(
        link.scope || ROOT_SCOPE,
        link.target,
        link.source
      );
    }
  }

  private addToPortToSourceMap(link: PortLink<Link>) {
    return this.portToSourceMap.setNodeValue(
      link,
      link.scope || ROOT_SCOPE,
      link.port,
      link.target,
      link.source
    );
  }

  private addToSourceToPortMap(link: PortLink<Link>) {
    this.sourceToPortMap.setNodeValue(
      link,
      link.scope || ROOT_SCOPE,
      link.source,
      link.target,
      link.port
    );
  }

  private addToTargetToSourceMap(link: Link) {
    return this.targetToSourceMap.setNodeValue(
      link,
      link.scope || ROOT_SCOPE,
      link.target,
      link.source
    );
  }
}
