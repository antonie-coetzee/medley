export interface Module {
  import?: () => Promise<{ [key: string]: unknown }>;
  exportMap?: {
    [key: string]: ()=>Promise<unknown>;
  };
}