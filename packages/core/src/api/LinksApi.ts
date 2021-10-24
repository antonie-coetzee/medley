import { EventType, Link, MedleyEvent, PortLink } from "../core";
import { LinkRepo } from "../repos";

export class LinksApi<MLink extends Link = Link> extends EventTarget {

  constructor(private scopeId: string, private linkRepo: LinkRepo) {
    super();
  }

  public setLinks(links: Link[]) {
    this.linkRepo.set(links);
    
    this.dispatchEvent(new MedleyEvent(EventType.OnChange));
  }

  public getPortLinks(port: string, target: string){
    return this.linkRepo.getPortLinks(this.scopeId, port, target) as PortLink<MLink>[];
  }

  public getSourceToPortLinks(source: string) {
    return this.linkRepo.getSourceToPortLinks(this.scopeId, source) as PortLink<MLink>[];
  }

  public getSourceLinks(target: string) {
    return this.linkRepo.getSourceLinks(this.scopeId, target) as MLink[];
  }

  public addLink(newLink: MLink): void {
    const allowed = this.dispatchEvent(MedleyEvent.createCancelable(EventType.OnItemCreate, newLink));
    if (allowed) {
      const wasAdded = this.linkRepo.addLink(newLink);
      if (wasAdded) {
        this.dispatchEvent(MedleyEvent.create(EventType.OnChange));
      }
    }
  }

  public getLink(target: string, source: string, port?: string ): MLink {
    return this.linkRepo.getLink(this.scopeId, target, source, port) as MLink;
  }

  public getLinks(): MLink[] {
    return this.linkRepo.getLinks(this.scopeId) as MLink[];
  }

  public getAllLinks(): MLink[] {
    return this.linkRepo.getAllLinks() as MLink[];
  }

  public deleteLink(link: MLink): void {
    const allowed = this.dispatchEvent(MedleyEvent.createCancelable(EventType.OnItemDelete, link));
    if (allowed) {
      let wasDeleted = false;
      wasDeleted = this.linkRepo.deleteLink(link);
      if (wasDeleted) {
        this.dispatchEvent(MedleyEvent.create(EventType.OnChange));
      }
    }
  }
}
