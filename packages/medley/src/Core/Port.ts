export interface Port {
  name: string;
  description?: string;
  required?: boolean;
  arity?: number;
  clonable?: boolean;
}
