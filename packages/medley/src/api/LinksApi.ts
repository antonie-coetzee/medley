import { Link } from "../core";
import { LinkRepo } from "../repos";

export class LinksApi<TLink extends Link = Link>
  implements Omit<LinkRepo, "deleteNode" | "deleteNodesByType" | "upsertNode">
{
  constructor(private linkRepo: LinkRepo) {}

  public load(links: TLink[]): void {
    return this.linkRepo.load(links);
  }

  public getTargetLinks(
    target: string,
    name?: string,
    resolve?: boolean
  ): Link[] | undefined {
    return this.linkRepo.getTargetLinks(target, name, resolve) as TLink[];
  }

  public getSourceLinks(nodeId: string): TLink[] | undefined {
    return this.linkRepo.getSourceLinks(nodeId) as TLink[];
  }
  public addLink(source: string, target: string, port: string): void {
    return this.linkRepo.addLink(source, target, port);
  }
  public getLinks(): TLink[] {
    return this.linkRepo.getLinks() as TLink[];
  }
  public deleteLink(link: Link): void {
    return this.linkRepo.deleteLink(link);
  }
}
