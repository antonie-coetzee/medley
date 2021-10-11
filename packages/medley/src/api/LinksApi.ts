import { Events, EventType, Link } from "../core";
import { LinkRepo } from "../repos";

class MedleyEvent<T> extends Event {
  detail?:T
}

interface EventInit {
  detail?:any
}

export class LinksApi<TLink extends Link = Link> extends EventTarget {
  public events: Partial<Events<TLink>> = {};

  constructor(private scopeId: string, private linkRepo: LinkRepo) {
    super();
  }

  public load(links: Link[]) {
    this.linkRepo.load(links);
    this.dispatchEvent(new Event(EventType.OnLoad));
  }

  public getPortLinks(port: string, target: string): TLink[] {
    return this.linkRepo.getPortLinks(this.scopeId, port, target) as TLink[];
  }

  public getSourceLinks(source: string): TLink[] {
    return this.linkRepo.getSourceLinks(this.scopeId, source) as TLink[];
  }

  public addLink(newLink: TLink): void {
    const mEvent =  new MedleyEvent<TLink>(EventType.OnItemAdd, {
      cancelable: true,
    });
    mEvent.detail = newLink;
    const allowed = this.dispatchEvent(mEvent);
    if (allowed) {
      const wasAdded = this.linkRepo.addLink(newLink);
      if (wasAdded) {
        this.dispatchEvent(new Event(EventType.OnChange));
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
    const allowed = this.dispatchEvent(
      new CustomEvent(EventType.OnItemDelete, {
        detail: link,
        cancelable: true,
      })
    );
    if (allowed) {
      let wasDeleted = false;
      wasDeleted = this.linkRepo.deleteLink(link);
      if (wasDeleted) {
        this.dispatchEvent(new Event(EventType.OnChange));
      }
    }
  }
}
