export interface Port {
  name: string;
  description?: string;
  required?: boolean;
  hidden?: boolean;
  singleArity?: boolean;
  template?: boolean;
  // at runtime
  getType?: ()=>unknown;
  isType?: (type:unknown)=>boolean;
}

export interface TypedPort<T> extends Port {
  type?: T;
}
