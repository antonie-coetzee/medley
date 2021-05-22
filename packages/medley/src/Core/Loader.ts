import { Module } from "./Module";
import { Platform } from "./Platform";

export class Loader {
  constructor(private platform:Platform){}

  async importModule(module: Module, baseUrl?:URL):Promise<any>{
    if(this.platform.systemJsImport){
      const resolvedUrl = baseUrl ? new URL(module.systemUrl.toString(), new URL(module.baseUrl.toString(), baseUrl)) : module.systemUrl;
      return this.platform.systemJsImport(resolvedUrl.toString())    
    }else{
      const resolvedUrl = baseUrl ? new URL(module.esmUrl.toString(), new URL(module.baseUrl.toString(), baseUrl)) : module.esmUrl;
      return import(resolvedUrl.toString());
    }
  }

  async loadJson (url:URL): Promise<any>{
    if(this.platform.loadJson == null){
      throw new Error("platform json loader not defined")
    }
    return this.platform.loadJson(url.toString());
  }
}