import { Link } from "./core";
import { LinkRepo } from "./LinkRepo";

export class LinksApi<TLink extends Link = Link>
  implements Omit<LinkRepo, "deleteNode" | "deleteNodesByType" | "upsertNode"> {
  constructor(private linkRepo: LinkRepo) {}

  public load(links: TLink[]): void {
    return this.linkRepo.load(links);
  }
  public getPortLinks(
    nodeId: string,
    portName: string,
    resolve?: boolean
  ):
    | TLink[]
    | { portName: string; source: string; target: string }[]
    | undefined {
    return this.linkRepo.getPortLinks(nodeId, portName, resolve) as TLink[];
  }
  public getSourceToLinks(nodeId: string): TLink[] | undefined {
    return this.linkRepo.getSourceToLinks(nodeId) as TLink[];
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
