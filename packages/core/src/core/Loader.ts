import { EsmModule, Module, SystemModule, toCustomModule } from "./Module";

export type ImportFunction = (
  module: Module,
  origin: string | null,
  baseUrl?: URL
) => Promise<any>;

export class Loader {
  public origin: string | null = null;

  constructor(private importer?: ImportFunction) {}

  async importModule(module: Module, baseUrl?: URL): Promise<any> {
    const customModule = toCustomModule(module);
    if (customModule && customModule.import) {
      return customModule.import();
    }
    if (this.importer == null) {
      throw new Error("importer not defined");
    }
    return this.importer(module, this.origin, baseUrl);
  }

  public static SystemImportWrapper(importer: (url: string) => Promise<any>) {
    return (module: Module, origin: string, baseUrl?: URL) => {
      const systemModule = module as SystemModule;
      let resolvedModuleBaseUrl: URL | undefined;
      if (systemModule.base) {
        resolvedModuleBaseUrl = new URL(systemModule.base.toString(), baseUrl);
      }
      const resolvedUrl = new URL(
        systemModule.system.toString(),
        resolvedModuleBaseUrl
      );
      if (origin) {
        resolvedUrl.search = `origin=${encodeURIComponent(origin)}`;
      }
      return importer(resolvedUrl.toString());
    };
  }

  public static ESMImportWrapper(importer: (url: string) => Promise<any>) {
    return (module: Module, origin: string, baseUrl?: URL) => {
      const esmModule = module as EsmModule;
      let resolvedModuleBaseUrl: URL | undefined;
      if (esmModule.base) {
        resolvedModuleBaseUrl = new URL(esmModule.base.toString(), baseUrl);
      }
      const resolvedUrl = new URL(
        esmModule.esm.toString(),
        resolvedModuleBaseUrl
      );
      if (origin) {
        resolvedUrl.search = `origin=${encodeURIComponent(origin)}`;
      }
      return importer(resolvedUrl.toString());
    };
  }
}
