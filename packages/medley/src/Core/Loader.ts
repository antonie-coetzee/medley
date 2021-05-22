import { Module } from "./Module";

export interface PlatformOptions {
  loadJson?: (url:string)=>Promise<any>,
  systemJsImport?: (url:string)=>Promise<any>
}

export class Loader {
  constructor(private platformOptions:PlatformOptions){}

  async importModule(module: Module, baseUrl?:URL):Promise<any>{
    if(this.platformOptions.systemJsImport){
      const resolvedUrl = baseUrl ? new URL(module.systemUrl.toString(), new URL(module.baseUrl.toString(), baseUrl)) : module.systemUrl;
      return this.platformOptions.systemJsImport(resolvedUrl.toString())    
    }else{
      const resolvedUrl = baseUrl ? new URL(module.esmUrl.toString(), new URL(module.baseUrl.toString(), baseUrl)) : module.esmUrl;
      return import(resolvedUrl.toString());
    }
  }

  async loadJson (url:URL): Promise<any>{
    if(this.platformOptions.loadJson == null){
      throw new Error("platform json loader not defined")
    }
    return this.platformOptions.loadJson(url.toString());
  }
}