export enum ModuleType {
  ESM,
  SYSTEM,
}

export interface BaseModule {
  base?: URL;
}

export interface esmModule extends BaseModule {
  esm: string;
}

export interface systemModule extends BaseModule {
  system: string;
}

export type Module = esmModule | systemModule;

export const isModule = (module: any): module is Module => {
  return (module as esmModule).esm !== undefined || 
  (module as systemModule).system !== undefined
}


