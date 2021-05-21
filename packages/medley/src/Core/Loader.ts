import { Module } from "./Module";

export interface PlatformLoaders {
  json?: (url:string)=>Promise<any>,
  systemJs?: (url:string)=>Promise<any>
}

export class Loader {
  constructor(private platformLoaders:PlatformLoaders){}

  async importModule(module: Module):Promise<any>{
    if(this.platformLoaders.systemJs){
      return this.platformLoaders.systemJs(module.systemUrl.toString())    
    }else{
      return import(module.esmUrl.toString());
    }
  }

  async loadJson (url:URL): Promise<any>{
    if(this.platformLoaders.json == null){
      throw new Error("platform json loader not defined")
    }
    return this.platformLoaders.json(url.toString());
  }
}