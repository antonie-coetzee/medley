import { Link, ROOT_SCOPE, TreeMap } from "../core";

export type LinkRepoOptions = {};

export class LinkRepo {
  /* scope -> port -> target -> source -> link */
  private targetMap: TreeMap<Link>;
  private updateSourceMap: boolean = false;
  /* scope -> source -> target -> port -> link */
  private sourceMap: TreeMap<Link>;

  constructor() {
    this.targetMap = new TreeMap();
    this.sourceMap = new TreeMap();
  }

  public load(links: Link[]) {
    this.targetMap.clear();
    this.sourceMap.clear();
    for (const link of links) {
      this.addToTargetMap(link);
    }
    this.updateSourceMap = true;
  }

  public getPortLinks(scopeId: string, port: string, target: string) {
    return this.targetMap.getFromPath(false, scopeId, port, target);
  }

  public getSourceLinks(scopeId: string, source: string) {
    if (this.updateSourceMap) {
      this.sourceMap.clear();
      const allLinks = this.targetMap.getAll();
      for (const link of allLinks) {
        this.addToSourceMap(link);
      }
    }
    return this.sourceMap.getFromPath(true, scopeId, source);
  }

  public addLink(newLink: Link) {
    let wasAdded = false;
    wasAdded = this.addToTargetMap(newLink);
    this.updateSourceMap = true;
    return wasAdded;
  }

  public getLinks(scopeId: string) {
    return this.targetMap.getFromPath(true, scopeId);
  }

  public getAllLinks() {
    return this.targetMap.getAll();
  }

  public deleteLink(link: Link) {
    let wasDeleted = false;
    wasDeleted = this.targetMap.deleteNode(
      link.scope || ROOT_SCOPE,
      link.port,
      link.target,
      link.source
    );
    this.updateSourceMap = true;
    return wasDeleted;
  }

  private addToTargetMap(link: Link) {
    let scope = link.scope || ROOT_SCOPE;
    return this.targetMap.setNodeValue(
      link,
      scope,
      link.port,
      link.target,
      link.source
    );
  }

  private addToSourceMap(link: Link) {
    let scope = link.scope || ROOT_SCOPE;
    this.sourceMap.setNodeValue(
      link,
      scope,
      link.source,
      link.target,
      link.port
    );
  }
}
