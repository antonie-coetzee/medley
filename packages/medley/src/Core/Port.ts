export interface Port {
  name: string;
  description?: string;
  required?: boolean;
  hidden?: boolean;
  arity?: number;
  template?: boolean;
}
