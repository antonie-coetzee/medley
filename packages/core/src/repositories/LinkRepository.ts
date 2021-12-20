import {
  Link,
  ROOT_SCOPE,
  TreeMap,
  PortLink,
  isPortLink,
  AnyLink,
} from "../core";

export class LinkRepository<MLink extends Link = Link> {
  private updateSourceToPortMap: boolean = false;

  /* scope -> port -> target -> source -> link */
  private portToSourceMap: TreeMap<PortLink<MLink>>;
  /* scope -> source -> target -> port -> link */
  private sourceToPortMap: TreeMap<PortLink<MLink>>;
  /* scope -> target -> source */
  private targetToSourceMap: TreeMap<MLink>;

  constructor() {
    this.portToSourceMap = new TreeMap();
    this.sourceToPortMap = new TreeMap();
    this.targetToSourceMap = new TreeMap();
  }

  public setAllLinks(links: AnyLink<MLink>[]) {
    this.portToSourceMap.clearAllNodes();
    this.sourceToPortMap.clearAllNodes();
    this.targetToSourceMap.clearAllNodes();
    for (const link of links) {
      if (isPortLink(link)) {
        this.addToPortToSourceMap(link);
      } else {
        this.addToTargetToSourceMap(link);
      }
    }
    this.updateSourceToPortMap = true;
  }

  public getLink(
    scopeId: string,
    target: string,
    source: string,
    port?: string
  ) {
    if (port) {
      return this.portToSourceMap.getFromPath(
        false,
        scopeId,
        port,
        target,
        source)?.[0];
    } else {
      return this.targetToSourceMap.getFromPath(
        false,
        scopeId,
        target,
        source
      )?.[0];
    }
  }

  public addLink(link: AnyLink<MLink>) {
    if (isPortLink(link)) {
      this.updateSourceToPortMap = true;
      return this.addToPortToSourceMap(link);
    } else {
      return this.addToTargetToSourceMap(link);
    }
  }

  public getPortLinks(scopeId: string, port: string, target: string) {
    return this.portToSourceMap.getFromPath(false, scopeId, port, target);
  }

  public getSourceToPortLinks(scopeId: string, source: string) {
    if (this.updateSourceToPortMap) {
      this.sourceToPortMap.clearAllNodes();
      const allLinks = this.portToSourceMap.getAllNodes();
      for (const link of allLinks) {
        this.addToSourceToPortMap(link);
      }
    }
    return this.sourceToPortMap.getFromPath(true, scopeId, source);
  }

  public getSourceLinks(scopeId: string, target: string) {
    return this.targetToSourceMap.getFromPath(true, scopeId, target);
  }

  public getLinks(scopeId: string): AnyLink<MLink>[] {
    return [
      ...this.portToSourceMap.getFromPath(true, scopeId),
      ...this.targetToSourceMap.getFromPath(true, scopeId),
    ];
  }

  public getAllLinks(): AnyLink<MLink>[] {
    return [
      ...this.portToSourceMap.getAllNodes(),
      ...this.targetToSourceMap.getAllNodes(),
    ];
  }

  public deleteLink(link: AnyLink<MLink>) {
    if (isPortLink(link)) {
      this.updateSourceToPortMap = true;
      return this.portToSourceMap.deleteNode(
        link.scope || ROOT_SCOPE,
        link.port,
        link.target,
        link.source
      );
    } else {
      return this.targetToSourceMap.deleteNode(
        link.scope || ROOT_SCOPE,
        link.target,
        link.source
      );
    }
  }

  private addToPortToSourceMap(link: PortLink<MLink>) {
    return this.portToSourceMap.setNodeValue(
      link,
      link.scope || ROOT_SCOPE,
      link.port,
      link.target,
      link.source
    );
  }

  private addToSourceToPortMap(link: PortLink<MLink>) {
    this.sourceToPortMap.setNodeValue(
      link,
      link.scope || ROOT_SCOPE,
      link.source,
      link.target,
      link.port
    );
  }

  private addToTargetToSourceMap(link: MLink) {
    return this.targetToSourceMap.setNodeValue(
      link,
      link.scope || ROOT_SCOPE,
      link.target,
      link.source
    );
  }
}
