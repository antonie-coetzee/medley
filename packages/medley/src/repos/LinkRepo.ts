import { Link, TreeMap } from "../core";

export type LinkRepoOptions = {};

export class LinkRepo {
  private static defaultParent = "root";
  /* Parent -> Port -> Target -> Source -> link */
  private targetMap: TreeMap<Link>;  
  private updateSourceMap:boolean = false;
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
    }
    this.updateSourceMap = true;
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
    if(this.updateSourceMap){
      this.sourceMap.clear();
      const allLinks = this.targetMap.getAll();
      for (const link of allLinks ) {
        this.addToSourceMap(link);
      }
    }
    
    return this.sourceMap.getFromPath(true, parent, source);
  }

  public addLink(newLink: Link) {
    this.addToTargetMap(newLink);
    this.updateSourceMap = true;
  }

  public getLinks(parent?: string) {
    if (parent) {
      return this.targetMap.getFromPath(true, parent);
    } else {
      return this.targetMap.getAll();
    }
  }

  public deleteLink(link: Link) {
    let parent = link.parent || LinkRepo.defaultParent;
    this.targetMap.deleteNode(parent, link.port, link.target, link.source);
    this.updateSourceMap = true;
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
}
