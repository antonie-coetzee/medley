export enum ModuleType {
  ESM,
  SYSTEM,
  VIRTUAL,
}

export interface BaseModule {
  base?: URL;
}

export interface EsmModule extends BaseModule {
  esm: string;
}

export interface SystemModule extends BaseModule {
  system: string;
}

export interface VirtualModule extends BaseModule {
  exports: {};
}

export type Module = EsmModule | SystemModule | VirtualModule;

export const isModule = (module: any): module is Module => {
  return (
    (module as EsmModule).esm !== undefined ||
    (module as SystemModule).system !== undefined || 
    (module as VirtualModule).exports !== undefined
  );
};

export const toVirtualModule = (module: Module): VirtualModule | undefined => {
    if((module as VirtualModule).exports !== undefined){
        return module as VirtualModule;
    }
};

export const isVirtualModule = (module: Module): boolean => {
  return (module as VirtualModule).exports !== undefined ? true : false;
};
