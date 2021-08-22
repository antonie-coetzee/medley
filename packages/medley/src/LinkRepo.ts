import { Link } from "./core";

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

  public getTargetLinks(
    target: string,
    name?: string,
    resolve: boolean = true
  ) {
    const key = toTargetKey(target, name);
    if (resolve) {
      const links = this.resolveLinks(this.linkTargetMap.get(key))?.map(
        (l) => {
          return { source: l.source, target, name };
        }
      );
      return links;
    } else {
      return this.linkTargetMap.get(key);
    }
  }

  public getSourceLinks(source: string) {
    return this.linkSourceMap.get(source);
  }

  public addLink(
    source: string,
    target: string,
    name?: string,
  ) {
    const newLink = {
      target,
      source,
      name,
    };
    const links = this.getTargetLinks(target, name);
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
    const links = this.getTargetLinks(link.target);
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
    const key = toTargetKey(link.target, link.name);
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
    const key = toTargetKey(link.target);
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

  private resolveLinks(links: Link[] | undefined) {
    const srcLinks = links?.flatMap((l) => {
      const targetLinks = this.linkTargetMap.get(l.source);
      if(targetLinks){
        return this.resolveLinks(targetLinks);
      }else{
        return l;
      }      
    }) as Link[] | undefined;
    return srcLinks;
  }
}

const toTargetKey = function (targetId: string, name?: string) {
  if(name){
    return `${targetId}.${name}`;
  }else{
    return targetId;
  }    
}

const linksAreEqual = function (linkA: Link, linkB: Link) {
  return (
    linkA.target === linkB.target &&
    linkA.source === linkB.source &&
    linkA.name === linkB.name
  );
};
