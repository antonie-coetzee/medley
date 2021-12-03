import { Module } from "./Module";

export type ImportFunction = (
  module: Module,
  origin: string | null,
  baseUrl?: URL
) => Promise<any>;

export class Loader {
  public baseUrl?: URL;
  public origin: string | null = null;

  constructor(private importer?: ImportFunction) {}

  async importModule(module: Module): Promise<any> {
    if (typeof module.import === "function") {
      return module.import();
    }
    if (this.importer == null) {
      throw new Error("importer not defined");
    }
    return this.importer(module, this.origin, this.baseUrl);
  }

  public static SystemImportWrapper(
    importer: (url: string) => Promise<any>
  ): ImportFunction {
    return (module: Module, origin: string | null, baseUrl?: URL) =>
      Loader.import(importer, module, "system", origin, baseUrl);
  }

  public static ESMImportWrapper(
    importer: (url: string) => Promise<any>
  ): ImportFunction {
    return (module: Module, origin: string | null, baseUrl?: URL) =>
      Loader.import(importer, module, "esm", origin, baseUrl);
  }

  private static import(
    importer: (url: string) => Promise<any>,
    module: Module,
    moduleType: string,
    origin: string | null,
    baseUrl?: URL
  ) {
    const moduleUrl = module[moduleType];
    if (moduleUrl == null) {
      throw new Error(
        `module type: '${moduleType}' not valid for: ${JSON.stringify(
          module,
          null,
          2
        )}`
      );
    }
    let resolvedModuleBaseUrl: URL | undefined;
    if (module.base) {
      resolvedModuleBaseUrl = new URL(module.base.toString(), baseUrl);
    }
    const resolvedUrl = new URL(moduleUrl, resolvedModuleBaseUrl);
    if (origin) {
      resolvedUrl.search = `origin=${encodeURIComponent(origin)}`;
    }
    return importer(resolvedUrl.toString());
  }
}
