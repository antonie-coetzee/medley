import { esmModule, Module, systemModule } from "./Module";
import { Platform } from "./Platform";

export class Loader {
  constructor(private platform:Platform){}

  async importModule(module: Module, baseUrl?:URL):Promise<any>{
    let resolvedBasedUrl:URL | undefined;
    if(module.baseUrl){
      resolvedBasedUrl = new URL(module.baseUrl.toString(), baseUrl);
    }

    if(this.platform.systemJsImport){
      const systemModule = module as systemModule;   
      const resolvedUrl = new URL(systemModule.systemUrl.toString(), resolvedBasedUrl)
      return this.platform.systemJsImport(resolvedUrl.toString())    
    }else if(this.platform.esmImport) {
      const esmModule = module as esmModule;   
      const resolvedUrl = new URL(esmModule.esmUrl.toString(), resolvedBasedUrl)
      return this.platform.esmImport(resolvedUrl.toString());
    }else{
      throw new Error("platform module loader not defined");
    }
  }

  async loadJson (url:URL): Promise<any>{
    if(this.platform.loadJson == null){
      throw new Error("platform json loader not defined");
    }
    return this.platform.loadJson(url.toString());
  }
}