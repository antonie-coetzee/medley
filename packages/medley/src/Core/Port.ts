export interface Port {
  name: string;
  description?: string;
  required?: boolean;
  hidden?: boolean;
  singleArity?: boolean;
  template?: boolean;
}

export interface TypedPort<T> extends Port {
  type?: T;
}
