export enum ModuleType {
  ESM,
  SYSTEM,
  CUSTOM,
}

export interface BaseModule {
  base?: URL;
  nameSpace?: string;
}

export interface EsmModule extends BaseModule {
  esm: string;
}

export interface SystemModule extends BaseModule {
  system: string;
}

export interface CustomModule extends BaseModule {
  import?: () => Promise<any>;
}

export type Module = EsmModule | SystemModule | CustomModule;

export const isModule = (module: any): module is Module => {
  return (
    (module as EsmModule).esm !== undefined ||
    (module as SystemModule).system !== undefined || 
    (module as CustomModule).import !== undefined
  );
};

export const toEsmModule = (module: Module): EsmModule | undefined => {
  if((module as EsmModule).esm !== undefined){
      return module as EsmModule;
  }
};

export const toSystemModule = (module: Module): SystemModule | undefined => {
  if((module as SystemModule).system !== undefined){
      return module as SystemModule;
  }
};

export const toCustomModule = (module: Module): CustomModule | undefined => {
    if((module as CustomModule).import !== undefined){
        return module as CustomModule;
    }
};