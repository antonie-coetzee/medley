import { MemoryModule, Module } from "./Module";

export interface Loader<MModule extends Module = Module> {
  import(module: MModule, exportName: string): Promise<any>;
}

export class MemoryLoader implements Loader<MemoryModule> {
  async import(module: MemoryModule, exportName: string): Promise<any> {
    const mod = await module.import();
    return mod[exportName];
  }
}
