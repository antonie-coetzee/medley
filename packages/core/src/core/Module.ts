export interface Module {
  import?: () => Promise<{ [key: string]: unknown }>;
}