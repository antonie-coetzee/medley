type TreeMapNodeValue<T> = {
  tmap?: TreeMapNode<T>;
  value?: T;
};
type TreeMapNode<T> = {
  [index: string]: TreeMapNodeValue<T>;
};

export class TreeMap<T> {
  private rootNode: TreeMapNode<T> = {};

  constructor() {
    this.rootNode = {};
  }

  public setNodeValue(node: T, ...path: string[]) {
    this.checkPath(path);
    const nodeAtPath = this.getNodeFromPath(this.rootNode, true, path);
    if (nodeAtPath) {
      nodeAtPath.value = node;
    }
  }

  public getNodeValue(...path: string[]): T | undefined {
    this.checkPath(path);
    const nodeAtPath = this.getNodeFromPath(this.rootNode, false, path);
    if (nodeAtPath) {
      return nodeAtPath.value as T;
    }
  }

  public findLastNodeValue(nodeId:string, ...searchPath: string[]): T | undefined {
    this.checkPath(searchPath);
    return this.findLastMatch(this.rootNode, nodeId, searchPath);
  }

  public deleteNode(...path: string[]) {
    this.checkPath(path);
    if (path.length === 1) {
      delete this.rootNode[path[0]];
    }
    const parentNode = this.getNodeFromPath(this.rootNode, false, path.slice(0, -1));
    if (parentNode && parentNode.tmap) {
      delete parentNode.tmap[path[path.length - 1]];
    }
  }

  public getFromPath(recursive: boolean, ...path: string[]): T[] {
    this.checkPath(path);
    const nodeAtPath = this.getNodeFromPath(this.rootNode, false, path);
    if (nodeAtPath) {
      if (!recursive) {
        if (nodeAtPath.tmap) {
          return Object.values(nodeAtPath.tmap).map(n => n.value as T) || [];
        } else {
          return [nodeAtPath.value as T];
        }
      } else {
        return this.getNodeValuesRecursive(nodeAtPath) || [];
      }
    } else {
      return [];
    }
  }

  public getAll(): T[] {
    const childNodes = Object.values(this.rootNode);
    return childNodes.flatMap((cn) => this.getNodeValuesRecursive(cn)) || [];
  }

  public clear() {
    return (this.rootNode = {});
  }

  public toJson() {
    return JSON.stringify(this.rootNode, null, " ");
  }

  private checkPath(path: string[]) {
    if (path == null || path.length === 0) {
      throw new Error("path[s] not valid");
    }
  }

  private getNodeValuesRecursive(nodeValue: TreeMapNodeValue<T>): T[] {
    if (nodeValue.tmap) {
      const childNodes = Object.values(nodeValue.tmap);
      if (nodeValue.value) {
        return [
          nodeValue.value as T,
          ...childNodes.flatMap((cn) => this.getNodeValuesRecursive(cn)),
        ];
      } else {
        return childNodes.flatMap((cn) => this.getNodeValuesRecursive(cn));
      }
    } else if (nodeValue.value) {
      return [nodeValue.value as T];
    } else {
      return [];
    }
  }

  private getNodeFromPath(
    rootNode: TreeMapNode<T>,
    createIfNotExists: boolean,
    path: string[]
  ): TreeMapNodeValue<T> | undefined {
    let currentNode: TreeMapNode<T> = rootNode;
    for (let i = 0; i < path.length; i++) {
      let tempNode = currentNode[path[i]];
      if (createIfNotExists && tempNode == null) {
        tempNode = Object.create(null);
        currentNode[path[i]] = tempNode;
      }
      if (createIfNotExists && tempNode.tmap == null && i < path.length - 1) {
        tempNode.tmap = Object.create(null);
      }
      if (tempNode == null) {
        return;
      }
      if (i === path.length - 1) {
        currentNode = tempNode;
      } else if (tempNode.tmap) {
        currentNode = tempNode.tmap;
      } else {
        return;
      }
    }
    return currentNode;
  }

  private findLastMatch(
    rootNode: TreeMapNode<T>,
    nodeId: string,
    path: string[],
  ): T | undefined {
    let currentMatch: T | undefined;
    let currentNode: TreeMapNode<T> = rootNode;
    for (let i = 0; i < path.length; i++) {
      let tempNode = currentNode[path[i]];
      if (tempNode == null) {
        return currentMatch;
      }
      if(tempNode.tmap){
        currentMatch = tempNode.tmap[nodeId]?.value
      }
      if (i === path.length - 1) {
        currentNode = tempNode;
      } else if (tempNode.tmap) {
        currentNode = tempNode.tmap;
      } else {
        return currentMatch;
      }
    }
    return currentMatch;
  }
}
