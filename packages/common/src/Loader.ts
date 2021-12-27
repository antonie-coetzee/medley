import { Loader } from "@medley-js/core";
import { CType } from "./types";

export class CMemoryLoader implements Loader<CType> {
  async import(type: CType, exportName: string): Promise<unknown> {
    const mappedExport = type.exportMap?.[exportName];
    if(typeof mappedExport === "function"){
      return mappedExport();
    }
    if (typeof type.import === "function") {
      const importedModule = await type.import();
      if (typeof importedModule === "object") {
        return importedModule[exportName];
      }
    }
  }
}

export class CLoader extends CMemoryLoader {
  constructor(private importer?:(type: CType, exportName: string)=>Promise<unknown>) {
    super();
  }
  async import(type: CType, exportName: string): Promise<unknown> {
    const importedValue = await super.import(type, exportName)
    if(importedValue){
      return importedValue;  
    }
    return await this.importer?.call(this, type, exportName);
  }
}