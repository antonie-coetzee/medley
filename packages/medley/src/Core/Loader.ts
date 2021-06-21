import { esmModule, Module, systemModule } from "./Module";

export interface LoaderOptions {
  systemJsImport?: (url: string) => Promise<any>;
  esmImport?: (url: string) => Promise<any>;
}

export class Loader {
  constructor(private loaderOptions: LoaderOptions) {}

  async importModule(module: Module, baseUrl?: URL): Promise<any> {
    let resolvedModuleBaseUrl: URL | undefined;
    if (module.base) {
      resolvedModuleBaseUrl = new URL(module.base.toString(), baseUrl);
    }

    if (this.loaderOptions.systemJsImport) {
      const systemModule = module as systemModule;
      const resolvedUrl = new URL(
        systemModule.system.toString(),
        resolvedModuleBaseUrl
      );
      return this.loaderOptions.systemJsImport(resolvedUrl.toString());
    } else if (this.loaderOptions.esmImport) {
      const esmModule = module as esmModule;
      const resolvedUrl = new URL(
        esmModule.esm.toString(),
        resolvedModuleBaseUrl
      );
      return this.loaderOptions.esmImport(resolvedUrl.toString());
    } else {
      throw new Error("module loader not defined");
    }
  }
}
