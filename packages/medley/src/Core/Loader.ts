import { EsmModule, Module, ModuleType, SystemModule, toVirtualModule } from "./Module";

export interface LoaderOptions {
  moduleType: ModuleType;
  import: (url: string) => Promise<any>;
}

export class Loader {
  constructor(private loaderOptions: LoaderOptions) {}

  async importModule(
    module: Module,
    baseUrl?: URL,
    search?: string
  ): Promise<any> {
    let resolvedModuleBaseUrl: URL | undefined;
    const virtualModule = toVirtualModule(module);
    if(virtualModule){
      return virtualModule.exports;
    }
    if (module.base) {
      resolvedModuleBaseUrl = new URL(module.base.toString(), baseUrl);
    }
    let resolvedUrl: URL;
    switch (this.loaderOptions.moduleType) {
      case ModuleType.SYSTEM:
        const systemModule = module as SystemModule;
        resolvedUrl = new URL(
          systemModule.system.toString(),
          resolvedModuleBaseUrl
        );
        break;
      case ModuleType.ESM:
        const esmModule = module as EsmModule;
        resolvedUrl = new URL(esmModule.esm.toString(), resolvedModuleBaseUrl);
        break;
      default:
        throw new Error("module type not supported");
    }
    resolvedUrl.search = search || "";
    return this.loaderOptions.import(resolvedUrl.toString());
  }
}
