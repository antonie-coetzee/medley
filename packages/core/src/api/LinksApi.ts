import { EventType, Link, MedleyEvent } from "../core";
import { LinkRepo } from "../repos";

export class LinksApi<TLink extends Link = Link> extends EventTarget {

  constructor(private scopeId: string, private linkRepo: LinkRepo) {
    super();
  }

  public load(links: Link[]) {
    this.linkRepo.load(links);
    this.dispatchEvent(new MedleyEvent(EventType.OnLoad));
  }

  public getPortLinks(port: string, target: string): TLink[] {
    return this.linkRepo.getPortLinks(this.scopeId, port, target) as TLink[];
  }

  public getSourceLinks(source: string): TLink[] {
    return this.linkRepo.getSourceLinks(this.scopeId, source) as TLink[];
  }

  public addLink(newLink: TLink): void {
    const allowed = this.dispatchEvent(MedleyEvent.createCancelable(EventType.OnItemAdd, newLink));
    if (allowed) {
      const wasAdded = this.linkRepo.addLink(newLink);
      if (wasAdded) {
        this.dispatchEvent(MedleyEvent.create(EventType.OnChange));
      }
    }
  }

  public getLinks(): TLink[] {
    return this.linkRepo.getLinks(this.scopeId) as TLink[];
  }

  public getAllLinks(): TLink[] {
    return this.linkRepo.getAllLinks() as TLink[];
  }

  public deleteLink(link: TLink): void {
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