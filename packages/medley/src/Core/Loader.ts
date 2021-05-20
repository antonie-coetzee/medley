import { Module } from "./Module";
import "systemjs/dist/s.min.js";

export class Loader {
  static moduleType: "ESM" | "SYSTEM" = "ESM";

  async importModule(module: Module):Promise<any>{
    const url = Loader.moduleType === "ESM" ? module.esmUrl : module.systemUrl;
    const importedModule = await this.importUrl(url)
    return importedModule;
  }

  async importUrl (url:URL): Promise<any>{
    if(Loader.moduleType === "ESM"){
      return await import(url.toString());
    }else{     
      return await System.import(url.toString());
    }
  }
}