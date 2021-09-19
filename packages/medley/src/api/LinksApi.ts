import { Link } from "../core";
import { LinkRepo } from "../repos";

export class LinksApi<TLink extends Link = Link>
  implements Omit<LinkRepo, "load"> {
  constructor(private linkRepo: LinkRepo, private parent?: string) {}

  public getPortLinks(port: string, target: string): TLink[] {
    return this.linkRepo.getPortLinks(port, target, this.parent) as TLink[];
  }

  public getSourceLinks(source: string): TLink[] {
    return this.linkRepo.getSourceLinks(source, this.parent) as TLink[];
  }
  public addLink(newLink: TLink): void {
    return this.linkRepo.addLink(newLink);
  }
  public getLinks(): TLink[] {
    return this.linkRepo.getLinks(this.parent) as TLink[];
  }
  public deleteLink(link: Link): void {
    return this.linkRepo.deleteLink(link);
  }
}
