import { Link, PortLink } from "../core";
import { LinkRepository } from "../repositories";

export class Links<MLink extends Link = Link> {
  constructor(
    private scopeId: string,
    private linkRepo: LinkRepository<MLink>
  ) {}

  public async getPortLinks(
    port: string,
    target: string
  ): Promise<PortLink<MLink>[]> {
    return this.linkRepo.getPortLinks(this.scopeId, port, target);
  }

  public async getSourceToPortLinks(
    source: string
  ): Promise<PortLink<MLink>[]> {
    return this.linkRepo.getSourceToPortLinks(this.scopeId, source);
  }

  public async getSourceLinks(target: string): Promise<MLink[]> {
    return this.linkRepo.getSourceLinks(this.scopeId, target);
  }

  public async upsertLink(newLink: MLink): Promise<boolean> {
    return this.linkRepo.upsertLink(this.scopeId, newLink);
  }

  public async getLink(
    source: string,
    target: string,
    port?: string
  ): Promise<MLink | undefined> {
    return this.linkRepo.getLink(this.scopeId, source, target, port);
  }

  public async getLinks(): Promise<MLink[]> {
    return this.linkRepo.getLinks(this.scopeId);
  }

  public async deleteLink(link: MLink): Promise<boolean> {
    return this.linkRepo.deleteLink(this.scopeId, link);
  }
}
