export interface Module {}

export interface MemoryModule extends Module {
  import: () => Promise<{ [key: string]: any }>;
}
