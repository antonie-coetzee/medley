export interface BaseModule {
  base?: URL;
  nameSpace?: string;
  import?: () => Promise<any>;
}

export type Module = BaseModule & {
  [moduleType: string]: URL;
};