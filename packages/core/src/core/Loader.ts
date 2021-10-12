import {
  EsmModule,
  Module,
  SystemModule,
  toCustomModule
} from "./Module";

export type ImportFunction = (
  module: Module,
  version: string,
  baseUrl?: URL
) => Promise<any>;

export class Loader {
  constructor(private importer?: ImportFunction) {}

  public static SystemImportWrapper(importer: (url: string) => Promise<any>) {
    return (module: Module, version: string, baseUrl?: URL) => {
      const systemModule = module as SystemModule;
      let resolvedModuleBaseUrl: URL | undefined;
      if (systemModule.base) {
        resolvedModuleBaseUrl = new URL(systemModule.base.toString(), baseUrl);
      }
      const resolvedUrl = new URL(
        systemModule.system.toString(),
        resolvedModuleBaseUrl
      );
      resolvedUrl.search = `version=${version}`;
      return importer(resolvedUrl.toString());
    };
  }

  public static ESMImportWrapper(importer: (url: string) => Promise<any>) {
    return (module: Module, version: string, baseUrl?: URL) => {
      const esmModule = module as EsmModule;
      let resolvedModuleBaseUrl: URL | undefined;
      if (esmModule.base) {
        resolvedModuleBaseUrl = new URL(esmModule.base.toString(), baseUrl);
      }
      const resolvedUrl = new URL(
        esmModule.esm.toString(),
        resolvedModuleBaseUrl
      );
      resolvedUrl.search = `version=${version}`;
      return importer(resolvedUrl.toString());
    };
  }

  async importModule(
    module: Module,
    version: string,
    baseUrl?: URL
  ): Promise<any> {
    const customModule = toCustomModule(module);
    if (customModule && customModule.import) {
      return customModule.import();
    }
    if (this.importer == null) {
      throw new Error("importer not defined");
    }
    return this.importer(module, version, baseUrl);
  }
}
