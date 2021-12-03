import { Module } from "./Module";

export abstract class Loader {
  public baseUrl?: URL;

  async import(module: Module): Promise<any> {
    if (typeof module.import === "function") {
      return module.import();
    }
    const url = this.resolveModuleUrl(module, this.moduleType, this.baseUrl);
    return this.importFromUrl(url.toString());
  }

  isModule(module: Module): module is Module{
    if(module[this.moduleType] || module.import){
      return true;
    }else{
      return false;
    }
  }

  abstract get moduleType():string;

  abstract importFromUrl(url:string):Promise<any>;

  private resolveModuleUrl(
    module: Module,
    moduleType: string,
    baseUrl?: URL
  ) {
    const moduleUrl = module[moduleType];
    if (moduleUrl == null) {
      throw new Error(
        `module type: '${moduleType}' not valid for: ${JSON.stringify(
          module,
          null,
          2
        )}`
      );
    }
    let resolvedModuleBaseUrl: URL | undefined;
    if (module.base) {
      resolvedModuleBaseUrl = new URL(module.base.toString(), baseUrl);
    }
    const resolvedUrl = new URL(moduleUrl, resolvedModuleBaseUrl);
    return resolvedUrl;
  }
}

export class MemoryLoader extends Loader {
  constructor(){
    super();
  }
  get moduleType(): string {
    return "memory";
  }
  importFromUrl(url: string): Promise<any> {
    throw new Error("memory loader does not support loading from urls");
  }
}

export class SystemLoader extends Loader {
  constructor(private importFunction:(url: string)=>Promise<any>){
    super();
  }
  get moduleType(): string {
    return "system";
  }
  importFromUrl(url: string): Promise<any> {
    return this.importFunction(url);
  }
}

export class ESMLoader extends Loader {
  constructor(){
    super();
  }
  get moduleType(): string {
    return "esm";
  }
  importFromUrl(url: string): Promise<any> {
    return import(url);
  }
}
