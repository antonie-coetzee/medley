export interface BaseModule {
  baseUrl?: URL;
}

export interface esmModule extends BaseModule {
  esmUrl: string;
}

export interface systemModule extends BaseModule {
  systemUrl: string;
}

export type Module = esmModule | systemModule;
