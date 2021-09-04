import { Link, TreeMap } from "../core";

export type LinkRepoOptions = {};

export class LinkRepo {
  private static defaultParent = "root";
  /* Parent -> Port -> Target -> Source -> link */
  private targetMap: TreeMap<Link>;
  /* Parent -> Source -> Target -> Port -> link */
  private sourceMap: TreeMap<Link>;

  constructor(onConstruct?: (this: LinkRepo) => void) {
    onConstruct?.call(this);
    this.targetMap = new TreeMap();
    this.sourceMap = new TreeMap();
  }

  public load(links: Link[]) {
    this.targetMap.clear();
    this.sourceMap.clear();
    for (const link of links) {
      this.addToTargetMap(link);
      this.addToSourceMap(link);
    }
    //console.log(this.targetMap.toJson());
  }

  public getPortLinks(
    port: string,
    target: string,
    parent: string = LinkRepo.defaultParent,
  ) {
    const links = this.targetMap.getFromPath(false, parent, port, target);
    return links;
  }

  public getSourceLinks(
    source: string,
    parent: string = LinkRepo.defaultParent,
  ) {
    const links = this.sourceMap.getFromPath(true, parent, source);
    return links;
  }

  public addLink(newLink: Link) {
    this.addToTargetMap(newLink);
    this.addToSourceMap(newLink);
  }

  public getLinks(parent?: string) {
    if (parent) {
      return this.targetMap.getFromPath(true, parent);
    } else {
      return this.targetMap.getAll();
    }
  }

  public deleteLink(link: Link) {
    this.deleteFromTargetMap(link);
    this.deleteFromSourceMap(link);
  }

  private addToTargetMap(link: Link) {
    let parent = link.parent || LinkRepo.defaultParent;
    this.targetMap.setNodeValue(
      link,
      parent,
      link.port,
      link.target,
      link.source
    );
  }

  private addToSourceMap(link: Link) {
    let parent = link.parent || LinkRepo.defaultParent;
    this.sourceMap.setNodeValue(
      link,
      parent,
      link.source,
      link.target,
      link.port
    );
  }

  private deleteFromTargetMap(link: Link) {
    let parent = link.parent || LinkRepo.defaultParent;
    this.sourceMap.deleteNode(parent, link.port, link.target, link.source);
  }

  private deleteFromSourceMap(link: Link) {
    let parent = link.parent || LinkRepo.defaultParent;
    this.sourceMap.deleteNode(parent, link.source, link.target, link.port);
  }
}
