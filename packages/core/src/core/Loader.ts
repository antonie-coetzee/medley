import { Module } from "./Module";

export interface Loader<MModule extends Module = Module> {
  import(module: MModule, exportName: string): Promise<unknown>;
}

export class MemoryLoader<MModule extends Module = Module> implements Loader<MModule> {
  async import(module: MModule, exportName: string): Promise<unknown> {
    const mappedExport = module.exportMap?.[exportName];
    if(typeof mappedExport === "function"){
      return mappedExport();
    }
    if (typeof module.import === "function") {
      const importedModule = await module.import();
      if (typeof importedModule === "object") {
        return importedModule[exportName];
      }
    }
  }
}
