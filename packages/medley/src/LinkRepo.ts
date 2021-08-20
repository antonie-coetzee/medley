import { Link } from "./core";

type Splice = { source?: Link; target?: Link };

export class LinkRepo {
  private linkSourceMap: Map<string, Link[]> = new Map();
  private linkTargetMap: Map<string, Link[]> = new Map();

  constructor(onConstruct?: (this: LinkRepo) => void) {
    onConstruct?.call(this);
  }

  public load(links: Link[]) {
    this.linkTargetMap.clear();
    this.linkSourceMap.clear();
    for (const link of links) {
      this.addToTargetMap(link);
      this.addToSourceMap(link);
    }
  }

  public getPortLinks(
    nodeId: string,
    portName: string,
    resolve: boolean = true
  ) {
    const key = this.targetKey(nodeId, portName);
    if (resolve) {
      const links = this.resolveLinkChains(this.linkTargetMap.get(key))?.map(
        (l) => {
          return { portName, source: l.source, target: nodeId };
        }
      );
      return links;
    } else {
      return this.linkTargetMap.get(key);
    }
  }

  public getSourceToLinks(nodeId: string) {
    return this.linkSourceMap.get(nodeId);
  }

  public addLink(
    source: string,
    target: string,
    port: string,
    instance?: string
  ) {
    const newLink = {
      port,
      target,
      source,
      instance,
    };
    const links = this.getPortLinks(target, port, false);
    const existingLink = links?.find((l) => {
      if (linksAreEqual(l, newLink)) {
        return l;
      }
    });
    if (existingLink) {
      return;
    }

    this.addToTargetMap(newLink);
    this.addToSourceMap(newLink);
  }

  public getLinks() {
    return Array.from(this.linkTargetMap.values())
      .flatMap((el) => el)
      .sort((a, b) => a.target.localeCompare(b.target));
  }

  public deleteLink(link: Link) {
    const links = this.getPortLinks(link.target, link.port, false);
    const existingLink = links?.find((l) => {
      if (linksAreEqual(l, link)) {
        return l;
      }
    });
    if (existingLink) {
      this.deleteFromTargetMap(link);
      this.deleteFromSourceMap(link);
    }
  }

  private addToTargetMap(link: Link) {
    const key = this.targetKey(link.target, link.port);
    if (this.linkTargetMap.has(key)) {
      const links = this.linkTargetMap.get(key);
      links?.push(link);
    } else {
      this.linkTargetMap.set(key, [link]);
    }
  }

  private addToSourceMap(link: Link) {
    const key = link.source;
    if (this.linkSourceMap.has(key)) {
      const links = this.linkSourceMap.get(key);
      links?.push(link);
    } else {
      this.linkSourceMap.set(key, [link]);
    }
  }

  private deleteFromTargetMap(link: Link) {
    const key = this.targetKey(link.target, link.port);
    if (this.linkTargetMap.has(key)) {
      const links = this.linkTargetMap.get(key);
      if (links && links?.length > 1) {
        const idx = links.findIndex((l) => linksAreEqual(l, link));
        if (idx && idx > -1) {
          links?.splice(idx, 1);
        }
      } else {
        this.linkTargetMap.delete(key);
      }
    }
  }

  private deleteFromSourceMap(link: Link) {
    const key = link.source;
    if (this.linkSourceMap.has(key)) {
      const links = this.linkSourceMap.get(key);
      if (links && links?.length > 1) {
        const idx = links.findIndex((l) => linksAreEqual(l, link));
        if (idx && idx > -1) {
          links?.splice(idx, 1);
        }
      } else {
        this.linkSourceMap.delete(key);
      }
    }
  }

  private targetKey(nodeId: string, portName: string) {
    return `${nodeId}${portName}`;
  }

  private resolveLinkChains(links: Link[] | undefined) {
    const srcLinks = links?.flatMap((l) => {
      const targetLinks = this.linkTargetMap.get(l.source);
      return this.resolveLinkChains(targetLinks);
    }) as Link[] | undefined;
    return srcLinks;
  }
}

const linksAreEqual = function (linkA: Link, linkB: Link) {
  return (
    linkA.target === linkB.target &&
    linkA.source === linkB.source &&
    linkA.port === linkB.port
  );
};
