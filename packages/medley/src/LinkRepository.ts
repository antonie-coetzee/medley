import { Link } from "./core";

export class LinkRepository {
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

  public getNodePortLinks(nodeId: string, portName: string) {
    const key = this.keyFromNodeIdPortName(nodeId, portName);
    return this.targetIndex.get(key);
  }

  public getBelongToLinks(nodeId: string) {
    return this.sourceIndex.get(nodeId);
  }

  public addLink(sourceNodeId: string, targetNodeId: string, portName: string) {
    const links = this.getNodePortLinks(targetNodeId, portName);
    const existingLink = links?.find((l) => {
      if (
        l.targetNodeId === targetNodeId &&
        l.sourceNodeId === sourceNodeId &&
        l.portName === portName
      ) {
        return l;
      }
    });
    if (existingLink) {
      return;
    }
    const link = {
      portName,
      targetNodeId,
      sourceNodeId,
    };
    this.addToTargetIndex(link);
    this.addToSourceIndex(link);
  }

  public getLinks() {
    return Array.from(this.targetIndex.values())
      .flatMap((el) => el)
      .sort((a, b) => a.targetNodeId.localeCompare(b.targetNodeId));
  }

  private addToTargetIndex(link: Link) {
    const key = this.keyFromNodeIdPortName(link.targetNodeId, link.portName);
    if (this.targetIndex.has(key)) {
      const nodePortLinks = this.targetIndex.get(key);
      nodePortLinks?.push(link);
    } else {
      this.targetIndex.set(key, [link]);
    }
  }

  private addToSourceIndex(link: Link) {
    const key = link.sourceNodeId;
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
