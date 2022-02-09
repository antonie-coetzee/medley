import { DEFAULT_SCOPE, isPortLink, Link, PortLink, TreeMap } from "../core";

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

  public setLinks(links: MLink[]): void {
    this.portToSourceMap.clearNodes();
    this.sourceToPortMap.clearNodes();
    this.targetToSourceMap.clearNodes();
    for (const link of links) {
      this.upsertLink(link.scope || DEFAULT_SCOPE, link);
    }
  }

  public getLink(
    scopeId: string,
    source: string,
    target: string,
    port?: string
  ): MLink | undefined {
    if (port) {
      return this.portToSourceMap.getFromPath(
        false,
        scopeId,
        port,
        target,
        source
      )?.[0];
    } else {
      return this.targetToSourceMap.getFromPath(
        false,
        scopeId,
        target,
        source
      )?.[0];
    }
  }

  public upsertLink(scopeId: string, link: MLink): boolean {
    const linkScope = link.scope || DEFAULT_SCOPE;
    if (linkScope !== scopeId) {
      throw new Error(
        `link with scope: '${link.scope}' not equal to '${linkScope}'`
      );
    }
    if (isPortLink(link)) {
      this.updateSourceToPortMap = true;
      return this.setPortToSourceMap(link);
    } else {
      return this.setTargetToSourceMap(link);
    }
  }

  public getPortLinks(
    scopeId: string,
    port: string,
    target: string
  ): PortLink<MLink>[] {
    return this.portToSourceMap.getFromPath(false, scopeId, port, target);
  }

  public getSourceToPortLinks(
    scopeId: string,
    source: string
  ): PortLink<MLink>[] {
    if (this.updateSourceToPortMap) {
      this.sourceToPortMap.clearNodes();
      const allLinks = this.portToSourceMap.getNodes();
      for (const link of allLinks) {
        this.setSourceToPortMap(link);
      }
    }
    return this.sourceToPortMap.getFromPath(true, scopeId, source);
  }

  public getSourceLinks(scopeId: string, target: string): MLink[] {
    return this.targetToSourceMap.getFromPath(true, scopeId, target);
  }

  public getLinks(scopeId?: string): MLink[] {
    if (scopeId) {
      return [
        ...this.portToSourceMap.getFromPath(true, scopeId),
        ...this.targetToSourceMap.getFromPath(true, scopeId),
      ];
    } else {
      return [
        ...this.portToSourceMap.getNodes(),
        ...this.targetToSourceMap.getNodes(),
      ];
    }
  }

  public deleteLink(scopeId: string, link: MLink): boolean {
    const linkScope = link.scope || DEFAULT_SCOPE;
    if (linkScope !== scopeId) {
      throw new Error(
        `link with scope: '${link.scope}' not equal to '${linkScope}'`
      );
    }
    if (isPortLink(link)) {
      this.updateSourceToPortMap = true;
      return this.portToSourceMap.deleteNode(
        linkScope,
        link.port,
        link.target,
        link.source
      );
    } else {
      return this.targetToSourceMap.deleteNode(
        linkScope,
        link.target,
        link.source
      );
    }
  }

  private setPortToSourceMap(link: PortLink<MLink>) {
    return this.portToSourceMap.setNodeValue(
      link,
      link.scope || DEFAULT_SCOPE,
      link.port,
      link.target,
      link.source
    );
  }

  private setSourceToPortMap(link: PortLink<MLink>) {
    this.sourceToPortMap.setNodeValue(
      link,
      link.scope || DEFAULT_SCOPE,
      link.source,
      link.target,
      link.port
    );
  }

  private setTargetToSourceMap(link: MLink) {
    return this.targetToSourceMap.setNodeValue(
      link,
      link.scope || DEFAULT_SCOPE,
      link.target,
      link.source
    );
  }
}
