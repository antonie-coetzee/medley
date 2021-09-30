import { Link } from "../core";
import { LinkRepo } from "../repos";

export class LinksApi<TLink extends Link = Link>
  implements Omit<LinkRepo, "load"> {
  constructor(private scopeId:string, private linkRepo: LinkRepo) {}

  public load(links: Link[]) {
    this.linkRepo.load(links);
  }

  public getPortLinks(port: string, target: string): TLink[] {
    return this.linkRepo.getPortLinks(this.scopeId, port, target) as TLink[];
  }

  public getSourceLinks(source: string): TLink[] {
    return this.linkRepo.getSourceLinks(this.scopeId, source) as TLink[];
  }

  public addLink(newLink: TLink): void {
    return this.linkRepo.addLink(newLink);
  }

  public getLinks(): TLink[] {
    return this.linkRepo.getLinks(this.scopeId) as TLink[];
  }

  public getAllLinks(): TLink[] {
    return this.linkRepo.getAllLinks() as TLink[];
  }
  
  public deleteLink(link: Link): void {
    return this.linkRepo.deleteLink(link);
  }
}
