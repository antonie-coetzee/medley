import { Link, PortLink } from "../core";
import { LinkRepository } from "../repositories";

export class Links<MLink extends Link = Link> {
  constructor(private scopeId: string, private linkRepo: LinkRepository) {}

  public setLinks(links: Link[]) {
    this.linkRepo.set(links);
  }

  public getPortLinks(port: string, target: string) {
    return this.linkRepo.getPortLinks(
      this.scopeId,
      port,
      target
    ) as PortLink<MLink>[];
  }

  public getSourceToPortLinks(source: string) {
    return this.linkRepo.getSourceToPortLinks(
      this.scopeId,
      source
    ) as PortLink<MLink>[];
  }

  public getSourceLinks(target: string) {
    return this.linkRepo.getSourceLinks(this.scopeId, target) as MLink[];
  }

  public addLink(newLink: MLink): boolean {
    return this.linkRepo.addLink(newLink);
  }

  public getLink(target: string, source: string, port?: string): MLink {
    return this.linkRepo.getLink(this.scopeId, target, source, port) as MLink;
  }

  public getLinks(): MLink[] {
    return this.linkRepo.getLinks(this.scopeId) as MLink[];
  }

  public getAllLinks(): MLink[] {
    return this.linkRepo.getAllLinks() as MLink[];
  }

  public deleteLink(link: MLink): boolean {
    return this.linkRepo.deleteLink(link);
  }
}
