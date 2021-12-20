import { MemoryLoader } from "@medley-js/core";
import { CModule } from "types";

export class CLoader extends MemoryLoader<CModule> {
  constructor(private importer?:(module: CModule)=>Promise<unknown>) {
    super();
  }
  async import(module: CModule, exportName: string): Promise<unknown> {
    const importedValue = await this.importer?.call(this, module);
    if(importedValue){
      return importedValue;  
    }
    return super.import(module, exportName)
  }
}