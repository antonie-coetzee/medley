import { esmModule, Module, ModuleType, systemModule } from "./Module";

export interface LoaderOptions {
  moduleType: ModuleType;
  import: (url: string) => Promise<any>;
}

export class Loader {
  constructor(private loaderOptions: LoaderOptions) {}

  async importModule(module: Module, baseUrl?: URL): Promise<any> {
    let resolvedModuleBaseUrl: URL | undefined;
    if (module.base) {
      resolvedModuleBaseUrl = new URL(module.base.toString(), baseUrl);
    }
    let resolvedUrl: URL;
    switch (this.loaderOptions.moduleType) {
      case ModuleType.SYSTEM:
        const systemModule = module as systemModule;
        resolvedUrl = new URL(
          systemModule.system.toString(),
          resolvedModuleBaseUrl
        );
        break;
      case ModuleType.ESM:
        const esmModule = module as esmModule;
        resolvedUrl = new URL(esmModule.esm.toString(), resolvedModuleBaseUrl);
        break;
      default:
        throw new Error("module type not supported");
    }
    return this.loaderOptions.import(resolvedUrl.toString());
  }
}
