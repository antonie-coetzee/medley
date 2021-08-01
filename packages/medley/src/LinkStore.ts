import { Link, MapFactory, MapType } from "./core";

export class LinkStore {
  private sourceMap: Map<string, Link[]>;
  private targetMap: Map<string, Link[]>;

  constructor(mapFactory?:MapFactory) {
    if(mapFactory){
      this.sourceMap = mapFactory(MapType.LinkSource);
      this.targetMap = mapFactory(MapType.LinkTarget);
    }else{
      this.sourceMap = new Map();
      this.targetMap =  new Map();
    }
  }

  public load(links: Link[]) {
    this.targetMap.clear();
    for (const link of links) {
      this.addToTargetMap(link);
      this.addToSourceMap(link);
    }
  }

  public getPortLinks(nodeId: string, portName: string) {
    const key = this.keyFromNodeIdPortName(nodeId, portName);
    return this.targetMap.get(key);
  }

  public getBelongToLinks(nodeId: string) {
    return this.sourceMap.get(nodeId);
  }

  public addLink(source: string, target: string, port: string, instance?:string) {
    const links = this.getPortLinks(target, port);
    const existingLink = links?.find((l) => {
      if (
        l.target === target &&
        l.source === source &&
        l.port === port && 
        l.instance === instance
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
    this.addToTargetMap(link);
    this.addToSourceMap(link);
  }

  public getLinks() {
    return Array.from(this.targetMap.values())
      .flatMap((el) => el)
      .sort((a, b) => a.target.localeCompare(b.target));
  }

  private addToTargetMap(link: Link) {
    const key = this.keyFromNodeIdPortName(link.target, link.port);
    if (this.targetMap.has(key)) {
      const nodePortLinks = this.targetMap.get(key);
      nodePortLinks?.push(link);
    } else {
      this.targetMap.set(key, [link]);
    }
  }

  private addToSourceMap(link: Link) {
    const key = link.source;
    if (this.sourceMap.has(key)) {
      const belongTo = this.sourceMap.get(key);
      belongTo?.push(link);
    } else {
      this.sourceMap.set(key, [link]);
    }
  }

  private keyFromNodeIdPortName(nodeId: string, portName: string) {
    return `${nodeId}${portName}`;
  }
}
