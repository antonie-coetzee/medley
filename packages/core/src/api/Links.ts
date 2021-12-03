import { AnyLink, Link, PortLink } from "../core";
import { LinkRepository } from "../repositories";

export class Links<MLink extends Link = Link> {
  constructor(
    private scopeId: string,
    private linkRepo: LinkRepository<MLink>
  ) {}

  public setLinks(links: AnyLink<MLink>[]) {
    this.linkRepo.set(links);
  }

  public getPortLinks(port: string, target: string): PortLink<MLink>[] {
    return this.linkRepo.getPortLinks(this.scopeId, port, target);
  }

  public getSourceToPortLinks(source: string): PortLink<MLink>[] {
    return this.linkRepo.getSourceToPortLinks(this.scopeId, source);
  }

  public getSourceLinks(target: string): MLink[] {
    return this.linkRepo.getSourceLinks(this.scopeId, target);
  }

  public addLink(newLink: AnyLink<MLink>): boolean {
    return this.linkRepo.addLink(newLink);
  }

  public getLink(
    target: string,
    source: string,
    port?: string
  ): MLink | undefined {
    return this.linkRepo.getLink(this.scopeId, target, source, port);
  }

  public getLinks(): AnyLink<MLink>[] {
    return this.linkRepo.getLinks(this.scopeId);
  }

  public getAllLinks(): AnyLink<MLink>[] {
    return this.linkRepo.getAllLinks();
  }

  public deleteLink(link: MLink): boolean {
    return this.linkRepo.deleteLink(link);
  }
}
