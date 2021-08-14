import { Link } from "./core";

type Splice = { source?: Link; target?: Link };

export class LinkRepo {
  private linkSourceMap: Map<string, Link[]> = new Map();
  private linkTargetMap: Map<string, Link[]> = new Map();
  private linkSpliceMap: Map<string, Splice> = new Map();

  constructor(onConstruct?: (this: LinkRepo) => void) {
    onConstruct?.call(this);
  }

  public load(links: Link[]) {
    this.linkTargetMap.clear();
    this.linkSourceMap.clear();
    this.linkSpliceMap.clear();
    for (const link of links) {
      this.addToTargetMap(link);
      this.addToSourceMap(link);
      this.addToSpliceMap(link);
    }
  }

  public getPortLinks(
    nodeId: string,
    portName: string,
    resolve: boolean = true
  ) {
    const key = this.targetKey(nodeId, portName);
    if (resolve) {
      return this.resolveSplices(this.linkTargetMap.get(key));
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

  private addToSpliceMap(link: Link) {
    if (link.spliceId == null) {
      return;
    }
    const splice = this.linkSpliceMap.get(link.spliceId);
    if (splice == null) {
      this.linkSpliceMap.set(
        link.spliceId,
        link.spliceSource ? { source: link } : { target: link }
      );
    } else {
      if (link.spliceSource) {
        splice.source = link;
      } else {
        splice.target = link;
      }
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

  private resolveSplices(links: Link[] | undefined) {
    return links?.map((l) => {
      if (l.spliceId == null) {
        return l;
      }
      const splice = this.linkSpliceMap.get(l.spliceId);
      if (splice == null) {
        throw new Error(`splice with id: '${l.spliceId}' missing`);
      }
      if (splice.source == null) {
        throw new Error(`splice source with id: '${l.spliceId}' missing`);
      }
      if (splice.target == null) {
        throw new Error(`splice target with id: '${l.spliceId}' missing`);
      }

      return { ...splice.source, target: splice.target.target };
    });
  }
}

const linksAreEqual = function (linkA: Link, linkB: Link) {
  return (
    linkA.target === linkB.target &&
    linkA.source === linkB.source &&
    linkA.port === linkB.port &&
    linkA.instance === linkB.instance
  );
};
