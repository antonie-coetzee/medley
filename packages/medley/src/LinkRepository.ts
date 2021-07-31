import { Link } from "./core";

export class LinkRepository {
  private terminalIndex: Map<string, Link[]> = new Map();
  private sourceIndex: Map<string, Link[]> = new Map();
  private targetIndex: Map<string, Link[]> = new Map();

  constructor() {}

  public load(links: Link[]) {
    this.targetIndex.clear();
    for (const link of links) {
      this.addToTargetIndex(link);
      this.addToSourceIndex(link);
    }
  }

  public getPortLinks(nodeId: string, portName: string) {
    const key = this.keyFromNodeIdPortName(nodeId, portName);
    return this.targetIndex.get(key);
  }

  public getPortInstanceLinks(nodeId: string, portName: string) {
    const key = this.keyFromNodeIdPortName(nodeId, portName);
    return this.targetIndex.get(key)?.filter(l=>l.instance);
  }

  public getBelongToLinks(nodeId: string) {
    return this.sourceIndex.get(nodeId);
  }

  public addLink(source: string, target: string, port: string) {
    const links = this.getPortLinks(target, port);
    const existingLink = links?.find((l) => {
      if (
        l.target === target &&
        l.source === source &&
        l.port === port
      ) {
        return l;
      }
    });
    if (existingLink) {
      return;
    }
    const link = {
      port,
      target,
      source,
    };
    this.addToTargetIndex(link);
    this.addToSourceIndex(link);
  }

  public getLinks() {
    return Array.from(this.targetIndex.values())
      .flatMap((el) => el)
      .sort((a, b) => a.target.localeCompare(b.target));
  }

  private addToTargetIndex(link: Link) {
    const key = this.keyFromNodeIdPortName(link.target, link.port);
    if (this.targetIndex.has(key)) {
      const nodePortLinks = this.targetIndex.get(key);
      nodePortLinks?.push(link);
    } else {
      this.targetIndex.set(key, [link]);
    }
  }

  private addToSourceIndex(link: Link) {
    const key = link.source;
    if (this.sourceIndex.has(key)) {
      const belongTo = this.sourceIndex.get(key);
      belongTo?.push(link);
    } else {
      this.sourceIndex.set(key, [link]);
    }
  }

  private keyFromNodeIdPortName(nodeId: string, portName: string) {
    return `${nodeId}${portName}`;
  }
}
